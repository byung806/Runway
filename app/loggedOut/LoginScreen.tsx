import { Button, Text, TextInput } from '@/components/2d';
import { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FirebaseError, ThemeContext, useFirebase } from '@/providers';
import { Styles } from '@/styles';
import { callWithTimeout } from '@/utils/utils';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


export default function LoginScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    // TODO: add back button to start screen
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const focused = useIsFocused();

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
        if (username.length < 3 || password.length < 6) {
            setErrorMessage('Incorrect password!');
            return
        }
        setErrorMessage('');
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
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMessage('Please try again in one minute.');
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
        <View style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }}>
            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, flex: 1 }}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', gap: 10 }}
                    >
                        <Text style={{ color: theme.white, fontSize: 40, textAlign: 'center', margin: 20 }}>Enter your username and password!</Text>
                        <TextInput
                            onChangeText={setUsername}
                            placeholder={'Username'}
                            style={{ width: '80%', height: 50 }}
                        />
                        <TextInput
                            placeholder={'Password'}
                            password={true}
                            onChangeText={setPassword}
                            style={{ width: '80%', height: 50 }}
                            disabled={loading}
                        />
                        <Button
                            title={'Log In!'}
                            disabled={loading}
                            onPress={loginCallback}
                            style={{ width: '40%', height: 50, marginTop: 10 }}
                        />
                        {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.white }}>{errorMessage}</Text> : null}
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
