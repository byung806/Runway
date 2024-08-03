import { Button, Text, TextInput, ThemeContext } from '@/components/2d';
import { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Styles } from '@/styles';
import { FirebaseError, useFirebase } from '@/utils/FirebaseProvider';
import { callWithTimeout } from '@/utils/utils';
import { StackNavigationProp } from '@react-navigation/stack';

export default function LoginScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    // TODO: add back button to start screen
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
        <View style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }}>
            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, flex: 1 }}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', gap: 10 }}
                    >
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
                        {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.text }}>{errorMessage}</Text> : null}
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
