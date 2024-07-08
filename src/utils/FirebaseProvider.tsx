import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import React, { ReactNode, createContext, useContext, useState } from 'react';

const emailEnding = '@example.com';

export interface UserData {
    email: string;
    friends: string[];
    password: string;
    point_days: { [date: string]: number };
    points: number;
    streak: number;
    uid: string;
    username: string;
}

interface LeaderboardUser {
    username: string;
    points: number;
    streak: number;
}

interface FirebaseContextType {
    user: FirebaseAuthTypes.User | null;
    registerUser: (username: string, email: string, password: string) => Promise<Error | null>;
    logIn: (email: string, password: string) => Promise<Error | null>;
    logOut: () => Promise<void>;
    checkUncompletedChallengeToday: () => Promise<boolean>;
    getUserData: () => Promise<UserData | null>;
    requestCompleteToday: () => Promise<{ dataChanged: boolean }>;
    addFriend: (friend: string) => Promise<{ success: boolean }>;
    getLeaderboard: (type: 'friends' | 'global') => Promise<{ leaderboard: LeaderboardUser[]; rank: number; }>;
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
    // Tracks auth().currentUser - doesn't use onAuthStateChanged because on user creation additional initialization is needed
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(auth().currentUser);

    /**
     * Registers a new user with the given username, email, and password
     */
    async function registerUser(username: string, email: string, password: string) {
        try {
            console.log('DATABASE CALL: create user');
            await auth().createUserWithEmailAndPassword(username + emailEnding, password);

            // TODO: implement possibility of fail in server & here
            console.log('DATABASE CALL: initializeUser');
            await functions()
                .httpsCallable('initializeUser')({
                    email: email,
                    password: password,
                });

            setUser(auth().currentUser);
        } catch (error) {
            console.log(error + ' from FirebaseProvider.tsx:  registerUser');
            return error as Error;
        }
        return null;
    }

    /**
     * Tries to log in with the given username and password
     */
    async function logIn(username: string, password: string) {
        try {
            console.log('DATABASE CALL: sign in');
            await auth().signInWithEmailAndPassword(username + emailEnding, password);
            setUser(auth().currentUser);
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  logIn');
            return error;
        }
    };

    /**
     * Logs out the currently logged in user
     */
    async function logOut() {
        try {
            console.log('DATABASE CALL: sign out');
            await auth().signOut();
            setUser(auth().currentUser);
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  logOut');
            return error;
        }
    };

    /**
     * Checks if there is a new uncompleted challenge for the user to complete today
     */
    async function checkUncompletedChallengeToday() {
        try {
            console.log('DATABASE CALL: check uncompleted challenge today');
            const data = await functions()
                .httpsCallable('checkUncompletedChallengeToday')() as FirebaseFunctionsTypes.HttpsCallableResult<boolean>;
            return data.data as boolean;
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  checkUncompletedChallengeToday');
            return false;
        }
    }

    /**
     * Fetches the user data for the currently logged in user
     */
    async function getUserData() {
        try {
            console.log('DATABASE CALL: get user data');
            const userData = await functions()
                .httpsCallable('getUserData')() as FirebaseFunctionsTypes.HttpsCallableResult<UserData>;
            return userData.data as UserData;
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getUserData');
            return null;
        }
    }

    /**
     * Requests to the server to increment the streak and points for the logged in user
     * Fails if the user has already completed the day's challenge and it has been logged
     */
    async function requestCompleteToday() {
        console.log('DATABASE CALL: request complete today');
        const data = await functions()
            .httpsCallable('requestCompleteToday')() as FirebaseFunctionsTypes.HttpsCallableResult<{ dataChanged: boolean }>;
        return data.data as { dataChanged: boolean };
    }

    /**
     * Adds a friend to the current logged in user's friends list
     * 
     * @param friend the username of the friend to add
     * @returns whether the friend was successfully added
     */
    async function addFriend(friend: string) {
        try {
            console.log('DATABASE CALL: add friend ' + friend);
            const data = await functions()
                .httpsCallable('addFriend')({
                    friendUsername: friend,
                }) as FirebaseFunctionsTypes.HttpsCallableResult<{ success: boolean }>;
            return data.data as { success: boolean };
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  addFriend');
            return { success: false };
        }
    }

    /**
     * Fetches the leaderboard and the current user's rank
     */
    async function getLeaderboard(type: 'friends' | 'global') {
        try {
            console.log('DATABASE CALL: get ' + type + ' leaderboard');
            const data = await functions()
                .httpsCallable('getLeaderboard')({
                    type: type,
                }) as FirebaseFunctionsTypes.HttpsCallableResult<{
                    leaderboard: LeaderboardUser[];
                    rank: number;
                }>;
            return data.data as { leaderboard: LeaderboardUser[]; rank: number; };
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getLeaderboard');
            return { leaderboard: [], rank: 0 };
        }
    }

    return (
        <FirebaseContext.Provider value={{
            user,
            registerUser,
            logIn,
            logOut,
            checkUncompletedChallengeToday,
            getUserData,
            requestCompleteToday,
            addFriend,
            getLeaderboard,
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

// hook to use Firebase context
export const useFirebase = (): FirebaseContextType => {
    const firebase = useContext(FirebaseContext);
    if (!firebase) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return firebase;
};
