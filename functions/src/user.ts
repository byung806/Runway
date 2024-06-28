import { CallableRequest } from "firebase-functions/v2/https";
import { updateStreak } from "./streak";
import { getDbDoc } from "./utils";

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

    return;
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