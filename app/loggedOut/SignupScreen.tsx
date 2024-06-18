import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, OnboardingHeader, Text, TextInput } from '~/2d';

import { Styles } from '@/styles';
import { emailEnding, registerUser } from '@/utils/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCreateUserWithEmailAndPassword } from '@skillnation/react-native-firebase-hooks/auth';

export default function SignupScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const { colors } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    // TODO: validate form inputs

    useEffect(() => {
        // useEffect tracks changes in [user] variable
        // called once user is created and logged in
        if (user) {
            registerUser(user.user.uid, username, email, password);
            navigation.navigate('app');
        }
    }, [user]);

    if (error) {
        alert(error);
    }

    // TODO: refer friends
    return (
        <View style={{ ...Styles.flex, backgroundColor: colors.background }}>
            <SafeAreaView style={{...Styles.centeringContainer, ...Styles.flex }}>
                <OnboardingHeader
                    backgroundColor={colors.background}
                    prevButtonCallback={() => navigation.goBack()}
                />

                <View style={{...Styles.centeringContainer, margin: 50}}>
                    {/* <Logo /> */}
                    <Text style={Styles.title}>Sign Up!</Text>
                    <Text style={Styles.subtitle}>Create an account to start your flight.</Text>
                </View>

                {/* <Divider width={10} orientation='vertical' style={{marginBottom: 20}} /> */}

                <View style={{flex: 1, width: '90%'}}>
                    <TextInput placeholder={'Username'} onChangeText={setUsername} style={{ marginBottom: 10 }} />
                    <TextInput placeholder={'Email'} onChangeText={setEmail} email style={{ marginBottom: 10 }} />
                    <TextInput placeholder={'Password'} onChangeText={setPassword} password style={{ marginBottom: 10 }} />
                    <Button
                        label={'SIGN UP'}
                        disabled={loading}
                        callback={() => {createUserWithEmailAndPassword(username + emailEnding, password)}}
                    />

                    <Text style={{...Styles.subtitle, textAlign: 'center', marginVertical: 10}}>OR</Text>

                    <Button label={'I HAVE AN ACCOUNT'} filled={false} callback={() => navigation.navigate('login')} />
                </View>
            </SafeAreaView>
        </View>
    );
};
