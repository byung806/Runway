import { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo, OnboardingHeader, Text, TextInput, ThemeContext } from '@/components/2d';

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
        <View style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor, borderLeftWidth: 6, borderRightWidth: 6, borderColor: theme.runwayBorderColor }}>
            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, flex: 1 }}>

                    {/* <View style={{ ...Styles.centeringContainer, margin: 50, flex: 1 }}>
                        <Logo />
                        <Text style={Styles.title}>Welcome Back!</Text>
                        <Text style={{ ...Styles.subtitle, color: theme.subtext }}>Log in to continue your flight.</Text>
                    </View> */}

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', gap: 10 }}
                    >
                        <TextInput
                            placeholder={'username'}
                            onChangeText={setUsername}
                            style={{ width: '80%' }}
                            disabled={loading}
                        />
                        <TextInput
                            placeholder={'password'}
                            password={true}
                            onChangeText={setPassword}
                            style={{ width: '80%' }}
                            disabled={loading}
                        />
                        <Button
                            title={'Log In!'}
                            disabled={loading}
                            onPress={loginCallback}
                            style={{ width: '80%' }}
                        />
                        {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.runwayTextColor }}>{errorMessage}</Text> : null}
                    </KeyboardAvoidingView>

                    <SafeAreaView style={{
                        position: 'absolute',
                        bottom: 0,
                    }} edges={['bottom']}>
                        <Button
                            title={'Don\'t have an account?'}
                            filled={false}
                            disabled={loading}
                            backgroundColor='transparent'
                            onPress={() => navigation.navigate('signup')}
                        />
                    </SafeAreaView>
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
