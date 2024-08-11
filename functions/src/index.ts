import { onCall } from "firebase-functions/v2/https";

import { initializeApp } from "firebase-admin/app";
import { requestCompleteDate } from "./streak";
import { addFriend, getUserData, initializeUser, sendExpoPushToken } from "./user";
import { getLeaderboard } from "./leaderboard";


initializeApp();

/**
 * Initializes a new user in the database
 */
exports.initializeUser = onCall(initializeUser);

/**
 * Updates the user's streak and points with validation
 */
exports.requestCompleteDate = onCall(requestCompleteDate);

/**
 * Ensures the streak is updated and gets the user's data
 */
exports.getUserData = onCall(getUserData);

/**
 * Adds a friend to the current logged in user's friends list (and vice versa)
 */
exports.addFriend = onCall(addFriend);

/**
 * Fetches the leaderboard and the current user's rank
 */
exports.getLeaderboard = onCall(getLeaderboard);

/**
 * Updates the user's expo push token
 */
exports.sendExpoPushToken = onCall(sendExpoPushToken);
