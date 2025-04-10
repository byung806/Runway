import { getTodayDate } from '@/utils/date';
import { delay } from '@/utils/utils';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePushNotifications } from './NotificationProvider';

const emailEnding = '@example.com';

export interface FirebaseError {
    code: string;
    message: string;
}

interface FirebaseUserData {
    email: string;
    friends: string[];
    point_days: { [date: string]: number };
    points: number;
    streak: number;
    uid: string;
    username: string;
    rated?: boolean;
    expoPushToken?: string;
}

export interface ContentColors {
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    outerBackgroundColor: string;
}

export interface FirebaseContentQuestion {
    question: string;
    choices: FirebaseContentQuestionChoice[];
}

export interface FirebaseContentQuestionChoice {
    choice: string;
    correct: boolean;
}

export interface FirebaseParagraphContentChunkType {
    type: 'paragraph';
    text: string;
}

export interface FirebaseImageContentChunkType {
    type: 'image';
    uri: string;
}

export interface FirebaseIconContentChunkType {
    type: 'icon';
    icon: string;
}

export interface FirebaseQuestionContentChunkType {
    type: 'question';
    question: string;
    choices: FirebaseContentQuestionChoice[];
}

export interface FirebaseEmptyContentChunkType {
    type: 'empty';
    fractionOfScreen: number;
}

export interface FirebaseContent {
    title: string;
    author: string;
    category: string;

    // new format
    chunks?: (FirebaseParagraphContentChunkType | FirebaseImageContentChunkType | FirebaseIconContentChunkType | FirebaseQuestionContentChunkType | FirebaseEmptyContentChunkType)[];

    // old format
    body?: string;
    questions?: FirebaseContentQuestion[];
}

export type LeaderboardType = 'friends' | 'global' | 'fame';

export interface LeaderboardUser {
    username: string;
    points: number;
    streak: number;
}

export interface LeaderboardData {
    leaderboard: LeaderboardUser[];
    rank: number;
}

interface FirebaseContextType {
    today: string;

    user: FirebaseAuthTypes.User | null;
    userData: FirebaseUserData | null;
    news: string | null;
    todayCompleted: boolean;
    globalLeaderboard: LeaderboardData | null;
    friendsLeaderboard: LeaderboardData | null;
    fameLeaderboard: LeaderboardData | null;

    questionIncorrectPointValues: { [key: number]: number };

    initializing: boolean;

    isUsernameAvailable: (username: string) => Promise<boolean>;
    registerUser: (username: string, email: string, password: string) => Promise<FirebaseError | null>;
    logIn: (email: string, password: string) => Promise<FirebaseError | null>;
    logOut: () => Promise<FirebaseError | null>;
    getUserData: () => Promise<void>;
    getContent: (date: string) => Promise<{ content: FirebaseContent, possiblePoints: number, colors: ContentColors } | null>;
    requestCompleteDate: (date?: string, percent?: number) => Promise<{ success: boolean }>;
    addFriend: (friend: string) => Promise<{ success: boolean, errorMessage: string }>;
    getLeaderboard: (type: LeaderboardType) => Promise<void>;
    updateDay: () => Promise<void>;
    setRated: () => Promise<void>;
    deleteAccount: () => Promise<{ success: boolean }>;

    sendExpoPushToken: (token: string) => Promise<void>;
}


export function FirebaseProvider({ children }: { children: ReactNode }) {
    const notifications = usePushNotifications();

    const [today, setToday] = useState(getTodayDate());  // TODO: day change

    // Mirror of auth().currentUser
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(auth().currentUser);
    const [userData, setUserData] = useState<FirebaseUserData | null>(null);
    const [news, setNews] = useState<string | null>(null);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardData | null>(null);
    const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardData | null>(null);
    const [fameLeaderboard, setFameLeaderboard] = useState<LeaderboardData | null>(null);

    const [questionIncorrectPointValues, setQuestionIncorrectPointValues] = useState<{ [key: number]: number }>({});

    const [initializing, setInitializing] = useState(true);
    const registeringUser = useRef(false);

    var debounceTimeout: NodeJS.Timeout | null;
    const debounceTime = 200;  // ms

    useEffect(() => {
        // console.log('FirebaseProvider useEffect:', notifications.expoPushToken, userData);
        if (notifications.expoPushToken && userData) {
            // console.log('Attempting to send expo push token');
            if (userData?.expoPushToken !== notifications.expoPushToken.data) {
                // console.log('Sending expo push token');
                sendExpoPushToken(notifications.expoPushToken.data);
            }
        }
    }, [userData, notifications.expoPushToken]);

    function onAuthStateChanged(authStateUser: FirebaseAuthTypes.User | null) {
        setUser(authStateUser);

        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            debounceTimeout = null;

            if (authStateUser) {
                while (registeringUser.current) {
                    // in this loop when firebase auth user is registered but user data is not yet initialized
                    await delay(300);
                }

                await getUserData();
                await getNews();
                setInitializing(false);

                getQuestionIncorrectPointValues();

                getLeaderboard('global');
                getLeaderboard('friends');
                getLeaderboard('fame');
            } else {
                setUserData(null);
                setTodayCompleted(false);
                setGlobalLeaderboard(null);
                setFriendsLeaderboard(null);
                setFameLeaderboard(null);
            }
            setInitializing(false);
        }, debounceTime);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    /**
     * Checks if the given username is available
     */
    async function isUsernameAvailable(username: string): Promise<boolean> {
        try {
            const data = await firestore().collection('usernames').doc(username).get();
            return !data.exists;
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  isUsernameAvailable');
            return true;
        }
    }

    /**
     * Registers a new user with the given username, email, and password
     */
    async function registerUser(username: string, email: string, password: string): Promise<FirebaseError | null> {
        try {
            registeringUser.current = true;
            console.log('DATABASE CALL: create user');
            await auth().createUserWithEmailAndPassword(username.trim().toLowerCase() + emailEnding, password);

            console.log('Expo Push Token:', notifications.expoPushToken);
            // TODO: implement possibility of fail in server & here
            console.log('DATABASE CALL: initializeUser');
            await functions()
                .httpsCallable('initializeUser')({
                    email: email
                });

            registeringUser.current = false;
        } catch (error) {
            console.log(error + ' from FirebaseProvider.tsx:  registerUser');
            return error as FirebaseError;
        }
        return null;
    }

    /**
     * Tries to log in with the given username and password
     */
    async function logIn(username: string, password: string): Promise<FirebaseError | null> {
        try {
            console.log('DATABASE CALL: sign in');
            await auth().signInWithEmailAndPassword(username.trim().toLowerCase() + emailEnding, password);
            return null;
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  logIn');
            return error as FirebaseError;
        }
    };

    /**
     * Logs out the currently logged in user
     */
    async function logOut(): Promise<FirebaseError | null> {
        try {
            console.log('DATABASE CALL: sign out');
            await auth().signOut();
            return null;
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  logOut');
            return error as FirebaseError;
        }
    };

    /**
     * Fetches the user data for the currently logged in user
     * Updates the userData state
     */
    async function getUserData(): Promise<void> {
        try {
            console.log('DATABASE CALL: get user data');
            const userData = await functions()
                .httpsCallable('getUserData')() as FirebaseFunctionsTypes.HttpsCallableResult<FirebaseUserData>;
            setUserData(userData.data);
            setTodayCompleted(today in (userData.data?.point_days ?? {}));
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getUserData');
        }
    }

    /**
     * Fetches the question incorrect point values from Firestore
     */
    async function getQuestionIncorrectPointValues() {
        try {
            console.log('DATABASE CALL: get question incorrect point values');
            const data = await firestore().collection('points').doc('incorrect').get();
            setQuestionIncorrectPointValues(data.data() as { [key: number]: number });
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getQuestionIncorrectPointValues');
        }
    }


    /**
     * Fetches the content for the given date from Firestore
     */
    // TODO: client could request content for any date, but server should only allow today and previous days
    async function getContent(date: string): Promise<{ content: FirebaseContent, possiblePoints: number, colors: ContentColors } | null> {
        try {
            console.log('DATABASE CALL: get content for', date);
            const doc = firestore().collection('content').doc(date)
            const data = await doc.get();
            if (data.exists) {
                const values = data.data();
                return {
                    content: values as FirebaseContent,
                    possiblePoints: values?.possiblePoints as number,
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
    async function requestCompleteDate(date?: string, percent?: number): Promise<{ success: boolean }> {
        console.log('DATABASE CALL: request complete date', date);
        const data = await functions()
            .httpsCallable('requestCompleteDate')({
                date: date,
                percent: percent,
            }) as FirebaseFunctionsTypes.HttpsCallableResult<{ success: boolean }>;

        const { success } = data.data;
        if (success) {
            await getUserData();
            getLeaderboard('global');  // no await because don't need to wait for this to finish
            getLeaderboard('friends');  // no await because don't need to wait for this to finish
            getLeaderboard('fame');
        } else {
            console.log('Something went wrong - today completed but database request failed');
        }
        return { success };
    }

    /**
     * Adds a friend to the current logged in user's friends list
     * 
     * @param friend the username of the friend to add
     * @returns whether the friend was successfully added
     */
    async function addFriend(friend: string): Promise<{ success: boolean, errorMessage: string }> {
        try {
            console.log('DATABASE CALL: add friend ' + friend);
            const data = await functions()
                .httpsCallable('addFriend')({
                    friendUsername: friend,
                }) as FirebaseFunctionsTypes.HttpsCallableResult<{ success: boolean, errorMessage: string }>;

            getLeaderboard('friends');  // no await because don't need to wait for this to finish
            return data.data as { success: boolean, errorMessage: string };
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  addFriend');
            return { success: false, errorMessage: 'Failed to add friend!' };
        }
    }

    /**
     * Fetches the leaderboard and the current user's rank
     */
    async function getLeaderboard(type: LeaderboardType): Promise<void> {
        try {
            console.log('DATABASE CALL: get ' + type + ' leaderboard');
            const data = await functions()
                .httpsCallable('getLeaderboard')({
                    type: type,
                }) as FirebaseFunctionsTypes.HttpsCallableResult<{
                    leaderboard: LeaderboardUser[];
                    rank: number;
                }>;
            if (type === 'global') {
                setGlobalLeaderboard(data.data);
            }
            if (type === 'friends') {
                setFriendsLeaderboard(data.data);
            }
            if (type === 'fame') {
                setFameLeaderboard(data.data);
            }
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  getLeaderboard');
        }
    }

    /**
     * Sends the expo push token to the server
     */
    async function sendExpoPushToken(token: string): Promise<void> {
        console.log('DATABASE CALL: send expo push token', token);
        await functions()
            .httpsCallable('sendExpoPushToken')({
                token: token,
            });
    }

    /**
     * Updates the today state to the current date
     */
    async function updateDay() {
        setToday(getTodayDate());
        setTodayCompleted(today in (userData?.point_days ?? {}));
    }

    /**
     * Get news if it exists
     */
    async function getNews() {
        console.log('DATABASE CALL: get news');
        const data = await firestore().collection('news').doc('news').get();
        if (data.exists) {
            setNews(data.get('text') as string);
        }
    }

    /**
     * 
     */
    async function setRated() {
        console.log('DATABASE CALL: set rated');
        await functions()
            .httpsCallable('setRated')();
    }

    /**
     * Deletes the current user's account
     */
    async function deleteAccount(): Promise<{ success: boolean }> {
        try {
            console.log('DATABASE CALL: delete account');
            await functions()
                .httpsCallable('deleteAccount')();
            return { success: true };
        } catch (error: any) {
            console.log(error + ' from FirebaseProvider.tsx:  deleteAccount');
            return { success: false };
        }
    }

    return (
        <FirebaseContext.Provider value={{
            today,

            user,
            userData,
            news,
            todayCompleted,
            globalLeaderboard,
            friendsLeaderboard,
            fameLeaderboard,

            questionIncorrectPointValues,

            initializing,

            isUsernameAvailable,
            registerUser,
            logIn,
            logOut,
            getUserData,
            getContent,
            requestCompleteDate,
            addFriend,
            getLeaderboard,
            updateDay,
            setRated,
            deleteAccount,

            sendExpoPushToken,
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
