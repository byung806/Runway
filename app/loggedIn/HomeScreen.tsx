import React, { useContext } from 'react';
import { View } from 'react-native';
import { Button, Plane, Text, ThemeContext } from '~/2d';

import { Styles } from '@/styles';
import { useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    // TODO: make ui for friending
    // TODO: implement content every day

    async function checkUncompletedChallengeToday() {
        const uncompletedChallengeToday = await firebase.checkUncompletedChallengeToday();
        console.log('uncompletedChallengeToday', uncompletedChallengeToday);
        if (uncompletedChallengeToday) {
            navigation.navigate('content');
        }
    }

    async function addFriend(username: string) {
        const { success } = await firebase.addFriend(username);
    }

    async function requestCompleteToday() {
        const { dataChanged } = await firebase.requestCompleteToday();
        if (dataChanged) {
            await triggerStreakScreen();
            await firebase.getUserData();
            // TODO: refresh leaderboard data
        }
    }

    async function triggerStreakScreen() {
        navigation.navigate('streak');
    }

    // TODO: better log out button
    async function logOut() {
        await firebase.logOut();
        navigation.navigate('start');
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
            </SafeAreaView>
            <View style={{ flex: 1, ...Styles.centeringContainer }}>
                <Text style={{ fontSize: 50 }}>{firebase.userData?.username}</Text>
                <Plane onPress={checkUncompletedChallengeToday} />
                <Text style={{ fontSize: 40 }}>{firebase.userData?.points}</Text>
                <Button title="Log Out" onPress={logOut} filled={false} />
                <Button title="today" onPress={requestCompleteToday} filled={false} />
            </View>
        </View>
    );
};
