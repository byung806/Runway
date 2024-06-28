import React, { useContext, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Loading, Text, ThemeContext } from '~/2d';
import { MainScene } from '~/3d';

import { Styles } from '@/styles';
import { UserData, useFirebase } from '@/utils/FirebaseProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

export default function HomeScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [userData, setUserData] = useState<UserData | null>(null);

    // on mount get user data
    // TODO: issue where if homescreen is already mounted then a new user signing in won't trigger this function
    useEffect(() => {
        console.log('from HomeScreen.tsx:  useEffect');
        getUserData();
    }, []);

    async function getUserData() {
        console.log('from HomeScreen.tsx:  getUserData');
        const data = await firebase.getUserData();
        setUserData(data);
    }

    async function requestCompleteToday() {
        if (!userData) {
            return;
        }
        const { dataChanged } = await firebase.requestCompleteToday();
        if (dataChanged) {
            console.log('from HomeScreen.tsx:  requestCompleteToday:  dataChanged');
            getUserData();
        }
    }

    // TODO: better log out button
    async function logOut() {
        await firebase.logOut();
        navigation.navigate('start');
    }

    if (!userData) {
        return <Button callback={logOut} title="logout (loading)" />;
    }
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{
                flex: 1,
                position: 'absolute',
                zIndex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                margin: 20
            }} edges={['top']}>
                <Button callback={requestCompleteToday} title="request complete today (dev)" />
                <Pressable onPress={logOut}>
                    <Text style={{
                        color: theme.text,
                        ...Styles.subtitle,
                    }}>
                        {userData?.username}
                    </Text>
                </Pressable>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <MaterialCommunityIcons name="trophy" size={30} color={theme.text} />
                    <Text style={{
                        color: theme.text,
                        ...Styles.subtitle,
                    }}>
                        {userData?.points}
                    </Text>
                </View>
            </SafeAreaView>
            <MainScene />
        </View>
    );
};
