import { Change, FirestoreEvent, onDocumentUpdated, onDocumentCreated } from "firebase-functions/v2/firestore";
import { AuthBlockingEvent, beforeUserCreated } from "firebase-functions/v2/identity";

import { initializeApp } from "firebase-admin/app";
import { QueryDocumentSnapshot, getFirestore } from "firebase-admin/firestore";


initializeApp();

export const onUserCreated = beforeUserCreated(async (event: AuthBlockingEvent) => {
    console.log('from index.ts:  onUserCreated triggered')
    // const user = event.data;
    // TODO: move creation logic here - get email and password data from client
});

// UNTESTED
// Listens for changes in /users/:userId, specifically new friends in the friends field of the user (an array of friend usernames)
// queries the /usernames collection (a mapping from usernames to uids) to find the friend's uid from their username
// and updates the friend's friends field (inside /users/friendId) to include the original user's username
export const onFriendAdded = onDocumentUpdated("users/{userId}", (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string; }>) => {
    console.log("from index.ts:  onDocumentUpdated triggered");
    const data = event.data;
    if (!data) {
        console.log("from index.ts:  onDocumentUpdated:  No data found in event");
        return;
    }
    const previousUser = data.before;
    const user = data.after;

    const pastFriends = previousUser.get("friends");
    const currentFriends = user.get("friends");

    // contains the usernames of the friends that were added (should be only 1 but checking for multiple just in case)
    const addedFriends = currentFriends.filter((friend: string) => !pastFriends.includes(friend));

    const db = getFirestore();

    addedFriends.forEach(async (friend: string) => {
        const friendDoc = await db.collection("usernames").doc(friend).get();
        if (!friendDoc.exists) {
            console.log("from index.ts:  onDocumentUpdated:  Friend " + friend + " not found");
            return;
        }
        const friendUid = friendDoc.get("uid");

        await db.collection("users")
            .doc(friendUid)
            .update({
                friends: [...new Set([...pastFriends, user.get("username")])]
            });
    });
});

// UNTESTED
// adds a new document to the /usernames collection when a new user is registered
// /usernames contains a mapping from usernames to uids

// right now the client creates the users/ document and the server creates the corresponding usernames/ (this is insecure)
// TODO: client requests to create an account and the server creates the users/ and usernames/ documents
export const onRegisteredUser = onDocumentCreated("users/{userId}", (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { userId: string; }>) => {
    console.log("from index.ts:  onDocumentCreated triggered");
    const data = event.data;
    if (!data) {
        console.log("from index.ts:  onDocumentCreated:  No data found in event");
        return;
    }
    const username = data.get("username");

    const db = getFirestore();
    db.collection("usernames").doc(username).set({
        uid: event.params.userId
    });
});

// export const onStreakRequest = onRequest(async (req, res) => {

// });

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// TODO: make server do all the registering initialization
// TODO: make login not use /auth
// TODO: cache streak, update on request from server every day
