import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
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

    const userDataRef = useRef<UserData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const isFocusedRef = useRef<boolean>(false);
    const isFocused = useIsFocused();

    // TODO: don't refresh user data every time isFocused changes - only when logged in/logged out changes
    // TODO: make ui for friending
    // TODO: implement content every day

    useEffect(() => {
        userDataRef.current = userData;
    }, [userData]);
    
    // on mount get user data
    useEffect(() => {
        isFocusedRef.current = isFocused;

        if (!isFocused) {
            return;
        }
        getUserData();

        // log out if no user data after 5 seconds
        setTimeout(() => {
            // need to use ref here because setTimeout doesn't read updated state
            if (!userDataRef.current && isFocusedRef.current) {
                logOut();
            }
        }, 5000);
    }, [isFocused]);

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
        setUserData(null);
    }

    if (!userData) {
        return <Loading />;
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
