import { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button3D, Logo, OnboardingHeader, Text, TextInput, ThemeContext } from '@/components/2d';

import { Styles } from '@/styles';
import { FirebaseError, useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { callWithTimeout } from '@/utils/utils';

export default function LoginScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setErrorMessage('');
    }, [username, password])

    // called on sign up button press
    async function loginCallback() {
        if (username.length == 0) {
            setErrorMessage('Please enter a username!');
            return;
        }
        if (password.length == 0) {
            setErrorMessage('Please enter a password!');
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        //TODO: login keeps running after 8 second timeout so it could just login after 8 seconds
        const error = await callWithTimeout(8000, firebase.logIn, username, password) as FirebaseError | null | 'timeout';

        if (error === null) {
            // now it's waiting for user data to load
        } else {
            setLoading(false);
            if (error === 'timeout') {
                setErrorMessage('Please try again later!');
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setErrorMessage('Incorrect password!');
            } else {
                console.log(error);
                setErrorMessage('Error logging in. Please try again later!');
            }
        }
        // const error = await firebase.logIn(username, password);
    }

    // only navigate to logged in app if user data is loaded
    useEffect(() => {
        setLoading(false);
    }, [firebase.userData]);

    return (
        <View style={{ ...Styles.flex, backgroundColor: theme.background }}>
            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, ...Styles.flex }}>
                    <OnboardingHeader
                        backgroundColor={theme.background}
                        prevButtonCallback={() => navigation.navigate('start')}
                    />

                    <View style={{ ...Styles.centeringContainer, margin: 50, flex: 1 }}>
                        <Logo />
                        <Text style={Styles.title}>Welcome Back!</Text>
                        <Text style={{ ...Styles.subtitle, color: theme.subtext }}>Log in to continue your flight.</Text>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 0, width: '90%' }}
                    >
                        <TextInput
                            placeholder={'Username'}
                            onChangeText={setUsername}
                            style={{ marginBottom: 10 }}
                            disabled={loading}
                        />
                        <TextInput
                            placeholder={'Password'}
                            password={true}
                            onChangeText={setPassword}
                            style={{ marginBottom: 10 }}
                            disabled={loading}
                        />
                        <Button3D
                            title={'LOGIN'}
                            disabled={loading}
                            onPress={loginCallback}
                        />
                        {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5 }}>{errorMessage}</Text> : null}
                    </KeyboardAvoidingView>

                    <Text style={{ ...Styles.subtitle, textAlign: 'center', marginVertical: 10 }}>OR</Text>

                    <Button3D
                        title={'CREATE AN ACCOUNT'}
                        filled={false}
                        disabled={loading}
                        onPress={() => navigation.navigate('signup')}
                        style={{ marginBottom: 20 }}
                    />
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
