import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Loading, Plane, Text, ThemeContext } from '~/2d';

import { Styles } from '@/styles';
import { UserData, useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    async function triggerStreakScreen() {
        navigation.navigate('streak');
    }

    // TODO: better log out button
    async function logOut() {
        await firebase.logOut();
        navigation.navigate('start');
    }

    if (!userData) {
        return (
            <View style={{ flex: 1, ...Styles.centeringContainer, backgroundColor: theme.background }}>
                <Loading />
            </View>
        )
    }
    return (
        // idea: drag plane to navigate to different screens
        // idea: pinterest circle expand menu
        <View style={{
            flex: 1,
            backgroundColor: theme.background,
        }}>
            <SafeAreaView style={{
                flex: 1,
                position: 'absolute',
                padding: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                ...Styles.borderRed
            }} edges={['top']}>
                <Button title="Log Out" onPress={logOut} filled={false} />
                <Button title="streak screen (dev)" onPress={triggerStreakScreen} filled={false} />
            </SafeAreaView>
            <View style={{ flex: 1, ...Styles.centeringContainer }}>
                <Text style={{ fontSize: 50 }}>{userData?.username}</Text>
                <Plane onPress={checkUncompletedChallengeToday} />
                <Text style={{ fontSize: 40 }}>{userData?.points}</Text>
            </View>
        </View>
    );
};
