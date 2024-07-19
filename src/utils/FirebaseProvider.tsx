import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const emailEnding = '@example.com';

interface UserData {
    email: string;
    friends: string[];
    password: string;
    point_days: { [date: string]: number };
    points: number;
    streak: number;
    uid: string;
    username: string;
}

export interface ContentColors {
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    outerBackgroundColor: string;
}

interface ContentQuestion {
    question: string;
    choices: ContentQuestionChoice[];
}

interface ContentQuestionChoice {
    choice: string;
    correct: boolean;
}

export interface Content {
    title: string;
    category: string;
    body: string;
    questions: ContentQuestion[];
}

export type LeaderboardType = 'friends' | 'global';

interface LeaderboardUser {
    username: string;
    points: number;
    streak: number;
}

interface LeaderboardData {
    leaderboard: LeaderboardUser[];
    rank: number;
}

interface FirebaseContextType {
    user: FirebaseAuthTypes.User | null;
    userData: UserData | null;
    globalLeaderboard: LeaderboardData | null;
    friendsLeaderboard: LeaderboardData | null;
    initializing: boolean;
    registerUser: (username: string, email: string, password: string) => Promise<Error | null>;
    logIn: (email: string, password: string) => Promise<Error | null>;
    logOut: () => Promise<void>;
    checkUncompletedChallengeToday: () => Promise<boolean>;
    getUserData: () => Promise<void>;
    getContent: (date: string) => Promise<{ content: Content, colors: ContentColors } | null>;
    requestCompleteToday: () => Promise<{ dataChanged: boolean }>;
    addFriend: (friend: string) => Promise<{ success: boolean }>;
    getLeaderboard: (type: LeaderboardType) => Promise<void>;
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
    // Mirror of auth().currentUser
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(auth().currentUser);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardData | null>(null);
    const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardData | null>(null);
    const [initializing, setInitializing] = useState(true);

    var debounceTimeout: NodeJS.Timeout | null;
    const debounceTime = 200;  // ms

    function onAuthStateChanged(authStateUser: FirebaseAuthTypes.User | null) {
        setUser(authStateUser);

        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            debounceTimeout = null;

            if (user) {
                await getUserData();
                await getLeaderboard('global');
                await getLeaderboard('friends');
            } else {
                setUserData(null);
                setGlobalLeaderboard(null);
                setFriendsLeaderboard(null);
            }
            setInitializing(false);
        }, debounceTime);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

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
     * Updates the userData state
     */
    async function getUserData() {
        try {
            console.log('DATABASE CALL: get user data');
            const userData = await functions()
                .httpsCallable('getUserData')() as FirebaseFunctionsTypes.HttpsCallableResult<UserData>;
            setUserData(userData.data);
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getUserData');
        }
    }

    async function getContent(date: string) {
        try {
            console.log('DATABASE CALL: get content');
            const doc = firestore().collection('content').doc(date)
            const data = await doc.get();
            if (data.exists) {
                const values = data.data();
                return {
                    content: values as Content,
                    colors: values?.colors as ContentColors,
                };
            }
            return null;
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getContent');
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
    async function getLeaderboard(type: LeaderboardType) {
        try {
            console.log('DATABASE CALL: get ' + type + ' leaderboard');
            const data = await functions()
                .httpsCallable('getLeaderboard')({
                    type: type,
                }) as FirebaseFunctionsTypes.HttpsCallableResult<{
                    leaderboard: LeaderboardUser[];
                    rank: number;
                }>;
            if (type === 'friends') {
                setFriendsLeaderboard(data.data);
            } else {
                setGlobalLeaderboard(data.data);
            }
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getLeaderboard');
        }
    }

    return (
        <FirebaseContext.Provider value={{
            user,
            userData,
            globalLeaderboard,
            friendsLeaderboard,
            initializing,
            registerUser,
            logIn,
            logOut,
            checkUncompletedChallengeToday,
            getUserData,
            getContent,
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
