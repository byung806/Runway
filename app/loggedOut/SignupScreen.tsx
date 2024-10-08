import { Button, Text, TextInput } from '@/components/2d';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FirebaseError, ThemeContext, useFirebase, usePushNotifications } from '@/providers';
import { Styles } from '@/styles';
import { matcher } from '@/utils/ProfanityChecker';
import { callWithTimeout } from '@/utils/utils';
import { StackNavigationProp } from '@react-navigation/stack';

export default function SignupScreen({ route, navigation }: { route: any, navigation: StackNavigationProp<any, any> }) {
    const initialUsername = route.params?.initialUsername;

    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const notifications = usePushNotifications();

    const [username, setUsername] = useState(initialUsername || '');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);

    // reset error message when user changes input
    useEffect(() => {
        setErrorMessage('');
    }, [username, password, email])

    // called on sign up button press
    async function signupCallback() {
        if (username.length < 3) {
            setErrorMessage('Please make your username at least 3 characters long!');
            return;
        }
        if (username.length > 15) {
            setErrorMessage('Please make your username at most 15 characters long!');
            return;
        }
        if (!username.match(/^[0-9a-z]+$/)) {
            setErrorMessage('Please only use letters and numbers in your username!');
            return
        }
        if (matcher.hasMatch(username)) {
            setErrorMessage('Please choose another username!');
            return
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setErrorMessage('Please enter a valid email!');
            return;
        }
        if (password.length < 6) {
            setErrorMessage('Please make your password at least 6 characters long!');
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        const error = await callWithTimeout(8000, firebase.registerUser, username, email, password) as FirebaseError | null | 'timeout';

        if (error === null) {
            // now it's waiting for user data to load
        } else {
            setLoading(false);
            if (error === 'timeout') {
                setErrorMessage('Please try again later!');
            } else if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('Username is already taken! Please choose another one.');
            }
            else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Please choose another username.');
            }
            else if (error.code === 'auth/weak-password') {
                setErrorMessage('Please choose a stronger password!');
            }
            else {
                setErrorMessage('Error signing up. Please try again later!');
            }
        }
    }

    // only navigate to logged in app if user data is loaded
    useEffect(() => {
        setLoading(false);
    }, [firebase.userData]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }}>
            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', gap: 10, ...Styles.centeringContainer }}
                    >
                        <TextInput
                            value={username}
                            placeholder={'Username'}
                            defaultValue={username}
                            onChangeText={setUsername}
                            maxLength={16}
                            style={{ width: '80%', height: 50 }}
                            disabled={loading}
                        />
                        <TextInput
                            value={email}
                            placeholder={'Email'}
                            onChangeText={setEmail}
                            email
                            style={{ width: '80%', height: 50 }}
                            disabled={loading}
                        />
                        <TextInput
                            value={password}
                            placeholder={'Password'}
                            onChangeText={setPassword}
                            password
                            style={{ width: '80%', height: 50 }}
                            disabled={loading}
                        />
                        <Button
                            title={'Take Off!'}
                            disabled={loading}
                            showLoadingSpinner={loading}
                            onPress={signupCallback}
                        />
                        {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.white }}>{errorMessage}</Text> : null}
                    </KeyboardAvoidingView>

                    <SafeAreaView style={{
                        position: 'absolute',
                        bottom: 0,
                    }} edges={['bottom']}>
                        <Button
                            title={'Have an account?'}
                            disabled={loading}
                            textColor={theme.white}
                            backgroundColor='transparent'
                            onPress={() => navigation.navigate('login')}
                        />
                    </SafeAreaView>
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
