import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { ReactNode, createContext, useContext, useEffect } from 'react';

const emailEnding = '@example.com';

function dateToString(date: Date): string {
    return date.toISOString().split('T')[0];
}

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
}

export function FirebaseProvider({ emulator = false, children }: { emulator?: boolean, children: ReactNode }) {
    useEffect(() => {
        // if (emulator) {
        //     console.log('Using Firebase emulator');
        //     auth().useEmulator('http://localhost:9099');
        //     firestore().useEmulator('localhost', 8080);
        // }
        // console.log('from FirebaseProvider.tsx:  Firebase initialized');
    }, []);

    async function registerUser(username: string, email: string, password: string) {
        try {
            const user = await auth().createUserWithEmailAndPassword(username + emailEnding, password);
            // console.log("from FirebaseProvider.tsx:  USER: " + user.user.toJSON());
            // console.log("from FirebaseProvider.tsx:  UID: " + user.user?.uid);
            const uid = user.user?.uid;
            // console.log("from FirebaseProvider.tsx:  " + auth().currentUser?.uid);
            await firestore()
                .collection('users')
                .doc(uid)
                .set({
                    email: email,
                    friends: [],
                    password: password,
                    point_days: {},
                    points: 0,
                    streak: 0,
                    uid: uid,
                    username: username
                })
            console.log('Registered user ' + username);
        } catch (error) {
            console.log(error);
            return error as Error;
        }
        return null;
    }

    async function logIn(username: string, password: string) {
        try {
            await auth().signInWithEmailAndPassword(username + emailEnding, password);
            console.log('from FirebaseProvider.tsx:  from logIn:  User signed in successfully');
        } catch (error: any) {
            console.log(error);
            return error;
        }
    };

    async function logOut() {
        try {
            await auth().signOut();
            console.log('from FirebaseProvider.tsx:  logOut:  User signed out successfully');
        } catch (error: any) {
            console.log(error);
            return error;
        }
    };

    async function getUserData() {
        try {
            const user = auth().currentUser;
            if (!user) {
                throw new Error('from FirebaseProvider.tsx:  from getUserData:  No user signed in');
            }
            const uid = user.uid;
            const userData = await firestore()
                .collection('users')
                .doc(uid)
                .get();
            return userData.data() as UserData;
        } catch (error: any) {
            console.log(error);
            return null;
        }
    }

    // TODO: test friends function
    async function addFriend(uid: string, friend: string) {
        try {
            await firestore()
                .collection('users')
                .doc(uid)
                .update({
                    friends: firestore.FieldValue.arrayUnion(friend)
                })
            console.log('Added friend ' + friend + ' to ' + uid);
        } catch (error: any) {
            console.log(error);
            return error.code;
        }
    }

    // TODO: streaks + points
    async function addPoints(uid: string, points: number) {
        const today = new Date().toDateString();

        await firestore()
            .collection('users')
            .doc(uid)
            .get()
    }

    return (
        <FirebaseContext.Provider value={{
            registerUser,
            logIn,
            logOut,
            getUserData
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
