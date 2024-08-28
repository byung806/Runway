import { initializeApp } from "firebase-admin/app";

initializeApp();

import { onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getLeaderboard } from "./leaderboard";
import { handleNotificationReceipts, sendStreakNotification, sendStreakNotificationDebug } from "./notifs";
import { requestCompleteDate, updateStreaksDaily } from "./streak";
import { addFriend, deleteAccount, getUserData, initializeUser, sendExpoPushToken } from "./user";


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

/**
 * Deletes the user's account
 */
exports.deleteAccount = onCall(deleteAccount);


/**
 * Updates the streaks for all users daily
 * Runs at 12:10 AM every day
 */
exports.updateStreaksDaily = onSchedule("10 0 * * *", updateStreaksDaily);

/**
 * Send a notification to all users with a valid expoPushToken
 * Runs at 12:00 AM every day
 */
exports.sendStreakNotification = onSchedule("0 0 * * *", sendStreakNotification);

exports.sendStreakNotificationDebug = onSchedule("0 0 * * *", sendStreakNotificationDebug);

/**
 * Check the status of push notification receipts 30 minutes after sending them
 * Runs at 12:30 AM every day
 */
exports.checkNotificationReceipts = onSchedule("30 0 * * *", handleNotificationReceipts);
