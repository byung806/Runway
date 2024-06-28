import { Change, FirestoreEvent, onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import { AuthBlockingEvent, beforeUserCreated } from "firebase-functions/v2/identity";

import { initializeApp } from "firebase-admin/app";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { completeTodayFunction } from "./streak";
import { getDbDoc } from "./utils";


initializeApp();

export const onUserCreated = beforeUserCreated(async (event: AuthBlockingEvent) => {
    console.log('from index.ts:  onUserCreated triggered')
    // const user = event.data;
    // TODO: move creation logic here - get email and password data from client
});
// TODO: make server do all the registering initialization
// TODO: make login not use /auth

// UNTESTED
/**
 * Listens for changes to the streak field in a user document and updates the streak field in the corresponding friend documents
 */
export const onFriendAdded = onDocumentUpdated("users/{userId}", async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string; }>) => {
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

    addedFriends.forEach(async (friend: string) => {
        const friendDoc = await getDbDoc('usernames', friend).get();
        if (!friendDoc.exists) {
            console.log("from index.ts:  onDocumentUpdated:  Friend " + friend + " not found");
            return;
        }
        const friendUid = friendDoc.get("uid");

        // update friend's friends field
        await getDbDoc('users', friendUid)
            .update({
                friends: [...new Set([...pastFriends, user.get("username")])]
            });
    });
});

/**
 * Updates the username → uid mapping when a user is registered
 */
export const onRegisteredUser = onDocumentCreated("users/{userId}", async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { userId: string; }>) => {
    // right now the client creates the users/ document and the server creates the corresponding usernames/ (this is insecure)
    // TODO: client requests to create an account and the server creates the users/ and usernames/ documents
    console.log("from index.ts:  onDocumentCreated triggered");
    const data = event.data;
    if (!data) {
        console.log("from index.ts:  onDocumentCreated:  No data found in event");
        return;
    }
    const username = data.get("username");

    await getDbDoc('usernames', username).set({
        uid: event.params.userId
    });
});

// ------------------ HTTPS CALLABLE FUNCTIONS ------------------

/**
 * Updates the user's streak and points with validation
 */
exports.requestCompleteToday = onCall(completeTodayFunction);

// export const getLeaderboard = onCall((request: CallableRequest) => {
// });
