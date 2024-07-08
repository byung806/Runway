import { CallableRequest } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { updateStreak } from "./streak";
import { getDbDoc } from "./utils";
import { updateLeaderboard } from "./leaderboard";

/**
 * Initializes the user document and the usernames → uid mapping when a user is registered
 */
export const initializeUser = async (request: CallableRequest): Promise<undefined> => {
    if (!request.auth) return;
    const uid = request.auth.uid;

    const email = request.data.email;
    const username = request.auth.token.email?.split('@')[0];
    if (!username) return;

    // Initializes the user document when a user is registered
    const userDoc = getDbDoc('users', uid);
    await userDoc.set({
        email: email,
        friends: [],
        password: request.data.password,
        point_days: {},
        points: 0,
        streak: 0,
        uid: uid,
        username: username
    });

    // Updates the username → uid mapping when a user is registered
    await getDbDoc('usernames', username).set({
        uid: uid
    });

    await updateLeaderboard(username, 0, 0);

    return;
}

/**
 * Checks if there is a new uncompleted challenge for the user to complete today
 */
export const checkUncompletedChallengeToday = async (request: CallableRequest): Promise<boolean> => {
    if (!request.auth) return false;
    const user = await getDbDoc('users', request.auth.uid).get();
    const today = new Date().toISOString().split('T')[0];

    if (!user.exists) return false;

    const userCompletedToday = today in user.get("point_days");
    const challengeExistsToday = (await getDbDoc('content', today).get()).exists;
    
    return !userCompletedToday && challengeExistsToday;
}

/**
 * Gets and returns the user data for the currently logged in user
 */
export const getUserData = async (request: CallableRequest): Promise<FirebaseFirestore.DocumentData | undefined> => {
    if (!request.auth) return;
    // TODO: limit updates per user to once per day
    await updateStreak(request.auth.uid, false);

    const userData = await getDbDoc('users', request.auth.uid).get();
    if (!userData.exists) {
        return;
    }
    return userData.data();
}

/**
 * Adds a friend to the current logged in user's friends list (and vice versa)
 */
export const addFriend = async (request: CallableRequest): Promise<{ success: boolean }> => {
    if (!request.auth) return { success: false };
    const user = await getDbDoc('users', request.auth.uid).get();
    const username = user.get("username");
    if (!request.data.friendUsername) return { success: false };
    const friend = await getDbDoc('usernames', request.data.friendUsername).get();
    if (!friend.exists) {
        return { success: false };
    }

    // check if friend is already friended
    if (user.get("friends").includes(request.data.friendUsername)) {
        return { success: false };
    }

    // update user's friends field
    await getDbDoc('users', request.auth.uid).update({
        friends: FieldValue.arrayUnion(request.data.friendUsername)
    });

    // update friend's friends field
    await getDbDoc('users', friend.get("uid")).update({
        friends: FieldValue.arrayUnion(username)
    });

    return { success: true };
}