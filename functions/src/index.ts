import { Change, FirestoreEvent, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";

import { initializeApp } from "firebase-admin/app";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { attemptIncrementStreak } from "./streak";
import { getDbDoc } from "./utils";
import { getUserData, initializeUser } from "./user";


initializeApp();

// TODO: make login not use /auth

// UNTESTED
// TODO: move this to a https callable
/**
 * Listens for changes to the streak field in a user document and updates the streak field in the corresponding friend documents
 */
export const onFriendAdded = onDocumentUpdated("users/{userId}", async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string; }>) => {
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

// ------------------ HTTPS CALLABLE FUNCTIONS ------------------

/**
 * Initializes a new user in the database
 */
exports.initializeUser = onCall(initializeUser);

/**
 * Updates the user's streak and points with validation
 */
exports.requestCompleteToday = onCall(attemptIncrementStreak);

/**
 * Ensures the streak is updated and gets the user's data
 */
exports.getUserData = onCall(getUserData);

// TODO: leaderboard
