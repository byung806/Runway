import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Loading, Plane, Text, ThemeContext } from '~/2d';

import { Styles } from '@/styles';
import { UserData, useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';

export default function HomeScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const userDataRef = useRef<UserData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const isFocusedRef = useRef<boolean>(false);
    const isFocused = useIsFocused();

    // TODO: make ui for friending
    // TODO: implement content every day

    // on mount get user data
    useEffect(() => {
        console.log('change in firebase.user detected: ' + firebase.user?.email);
        if (!firebase.user) {
            setUserData(null);
            return;
        }
        getUserData();
    }, [firebase.user]);

    useEffect(() => {
        userDataRef.current = userData;
    }, [userData]);

    useEffect(() => {
        isFocusedRef.current = isFocused;
        if (!isFocused) {
            return;
        }

        // log out if no user data after 5 seconds
        setTimeout(() => {
            // need to use ref here because setTimeout doesn't read updated state
            if (!userDataRef.current && isFocusedRef.current) {
                logOut();
            }
        }, 5000);
    }, [isFocused]);

    async function checkUncompletedChallengeToday() {
        const uncompletedChallengeToday = await firebase.checkUncompletedChallengeToday();
        console.log('uncompletedChallengeToday', uncompletedChallengeToday);
        if (uncompletedChallengeToday) {
            navigation.navigate('content');
        }
    }

    async function getUserData() {
        const data = await firebase.getUserData();
        setUserData(data);
    }

    async function addFriend(username: string) {
        const { success } = await firebase.addFriend(username);
    }

    // TODO: better log out button
    async function logOut() {
        await firebase.logOut();
        navigation.navigate('start');
    }

    if (!userData) {
        return <Loading />;
    }
    return (
        // idea: drag plane to navigate to different screens
        // idea: pinterest circle expand menu
        <View style={{ flex: 1, ...Styles.centeringContainer }}>
            <Text style={{ fontSize: 50 }}>{userData?.username}</Text>
            <Plane onPress={checkUncompletedChallengeToday} />
            <Text style={{ fontSize: 40 }}>{userData?.points}</Text>
            <Button onPress={logOut} title="Log Out" />
        </View>
    );
};
