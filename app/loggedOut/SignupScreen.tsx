import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo, OnboardingHeader, Text, TextInput, ThemeContext } from '~/2d';

import { Styles } from '@/styles';
import { useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';

export default function SignupScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>();

    // reset error message when user changes input
    useEffect(() => {
        setErrorMessage('');
    }, [username, password, email])

    // called when an error is detected on signup and should be shown to the user
    useEffect(() => {
        if (error) {
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('Please choose another username!');
            }
            else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Invalid email.');
            }
            else if (error.code === 'auth/weak-password') {
                setErrorMessage('Please choose a stronger password!');
            }
            else {
                setErrorMessage('Error signing up. Please try again later!');
            }
        }
    }, [error])

    // called on sign up button press
    async function signupCallback() {
        if (username.length < 3) {
            setErrorMessage('Please make your username at least 3 characters long!');
            return;
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
        const error = await firebase.registerUser(username, email, password);
        setError(error);
    }

    // only navigate to logged in app if user data is loaded
    useEffect(() => {
        // TODO: fade?
        setLoading(false);
        if (firebase.userData) navigation.navigate('logged_in_app');
    }, [firebase.userData]);

    // TODO: combine signup & login - enter username => check if user exists => if so, password to login, else, password to signup
    return (
        <View style={{ ...Styles.flex, backgroundColor: theme.background }}>
            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, ...Styles.flex }}>
                    <OnboardingHeader
                        backgroundColor={theme.background}
                        prevButtonCallback={() => navigation.goBack()}
                    />

                    <View style={{ ...Styles.centeringContainer, margin: 50, flex: 1 }}>
                        <Logo />
                        <Text style={Styles.title}>Sign Up!</Text>
                        <Text style={{...Styles.subtitle, color: theme.subtext}}>Create an account to start your flight.</Text>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 0, width: '90%' }}
                    >
                        <TextInput placeholder={'Username'} onChangeText={setUsername} style={{ marginBottom: 10 }} />
                        <TextInput placeholder={'Email'} onChangeText={setEmail} email style={{ marginBottom: 10 }} />
                        <TextInput placeholder={'Password'} onChangeText={setPassword} password style={{ marginBottom: 10 }} />
                        <Button
                            title={'SIGN UP'}
                            disabled={loading}
                            onPress={signupCallback}
                        />
                        {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5 }}>{errorMessage}</Text> : null}
                    </KeyboardAvoidingView>

                    <Text style={{ ...Styles.subtitle, textAlign: 'center', marginVertical: 10 }}>OR</Text>

                    <Button title={'I HAVE AN ACCOUNT'} filled={false} disabled={loading} onPress={() => navigation.navigate('login')} style={{ marginBottom: 20 }} />
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
