import { onCall } from "firebase-functions/v2/https";

import { initializeApp } from "firebase-admin/app";
import { attemptIncrementStreak } from "./streak";
import { addFriend, getUserData, initializeUser } from "./user";


initializeApp();

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

/**
 * Adds a friend to the current logged in user's friends list (and vice versa)
 */
exports.addFriend = onCall(addFriend);

// TODO: leaderboard
// TODO: make login not use /auth
