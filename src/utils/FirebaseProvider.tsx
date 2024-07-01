import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import React, { ReactNode, createContext, useContext } from 'react';

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

interface FirebaseContextType {
    registerUser: (username: string, email: string, password: string) => Promise<Error | null>;
    logIn: (email: string, password: string) => Promise<Error | null>;
    logOut: () => Promise<void>;
    getUserData: () => Promise<UserData | null>;
    requestCompleteToday: () => Promise<{ dataChanged: boolean }>;
    addFriend: (friend: string) => Promise<{ success: boolean }>;
}

export function FirebaseProvider({ emulator = false, children }: { emulator?: boolean, children: ReactNode }) {
    /**
     * Registers a new user with the given username, email, and password
     */
    async function registerUser(username: string, email: string, password: string) {
        try {
            await auth().createUserWithEmailAndPassword(username + emailEnding, password);

            // TODO: implement possibility of fail in server & here
            await functions()
                .httpsCallable('initializeUser')({
                    email: email,
                    password: password,
                });
            console.log('Registered user ' + username);
        } catch (error) {
            console.log(error);
            return error as Error;
        }
        return null;
    }

    /**
     * Tries to log in with the given username and password
     */
    async function logIn(username: string, password: string) {
        try {
            await auth().signInWithEmailAndPassword(username + emailEnding, password);
            console.log('from FirebaseProvider.tsx:  from logIn:  User signed in successfully');
        } catch (error: any) {
            console.log(error);
            return error;
        }
    };

    /**
     * Logs out the currently logged in user
     */
    async function logOut() {
        try {
            await auth().signOut();
            console.log('from FirebaseProvider.tsx:  logOut:  User signed out successfully');
        } catch (error: any) {
            console.log(error);
            return error;
        }
    };

    /**
     * Fetches the user data for the currently logged in user
     */
    async function getUserData() {
        try {
            // console.log('from FirebaseProvider.tsx:  from getUserData:  getUserData called');
            const userData = await functions()
                .httpsCallable('getUserData')() as FirebaseFunctionsTypes.HttpsCallableResult<UserData>;
            return userData.data as UserData;
        } catch (error: any) {
            console.log(error);
            return null;
        }
    }

    /**
     * Requests to the server to increment the streak and points for the logged in user
     * Fails if the user has already completed the day's challenge and it has been logged
     */
    async function requestCompleteToday() {
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
        const data = await functions()
            .httpsCallable('addFriend')({
                friendUsername: friend,
            }) as FirebaseFunctionsTypes.HttpsCallableResult<{ success: boolean }>;
        return data.data as { success: boolean };
    }

    return (
        <FirebaseContext.Provider value={{
            registerUser,
            logIn,
            logOut,
            getUserData,
            requestCompleteToday,
            addFriend,
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
