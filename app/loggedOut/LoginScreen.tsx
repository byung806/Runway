import { BackArrow, Button, Text, TextInput } from '@/components/2d';
import { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FirebaseError, ThemeContext, useFirebase } from '@/providers';
import { Styles } from '@/styles';
import { callWithTimeout } from '@/utils/utils';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


export default function LoginScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        if (username.length != 0 && password.length != 0) {
            setErrorMessage('');
        }
    }, [username, password])

    // called on sign up button press
    async function loginCallback() {
        // TODO: put all these checks in a util somewhere
        if (username.length == 0) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setErrorMessage('Please enter a username!');
            return;
        }
        if (password.length == 0) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setErrorMessage('Please enter a password!');
            return;
        }
        if (username.length < 3 || password.length < 6) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setErrorMessage('Incorrect password!');
            setPassword('');
            return
        }
        setErrorMessage('');
        Keyboard.dismiss();
        setLoading(true);
        const error = await callWithTimeout(8000, firebase.logIn, username, password) as FirebaseError | null | 'timeout';

        if (error === null) {
            // now it's waiting for user data to load
        } else {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setLoading(false);
            if (error === 'timeout') {
                setErrorMessage('Please try again later!');
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setErrorMessage('Incorrect password!');
                setPassword('');
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMessage('You\'re going too fast! Please give it a minute.');
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
            <View style={{
                position: 'absolute',
                top: 60,
                left: 20,
                zIndex: 1,
            }}>
                <BackArrow color={theme.runwayTextColor} onPress={() => { navigation.navigate('start') }} />
            </View>

            <TouchableOpacity activeOpacity={1.0} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                <SafeAreaView style={{ ...Styles.centeringContainer, flex: 1 }}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', ...Styles.centeringContainer }}
                    >
                        <View style={{
                            width: '100%',
                            ...Styles.centeringContainer,
                            gap: 10,
                        }}>
                            {/* <Text style={{ color: theme.white, fontSize: 24, textAlign: 'center', margin: 20 }}>Enter your username and password!</Text> */}
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder={'Username'}
                                autoComplete='username'
                                textContentType={'username'}
                                style={{ width: '80%', height: 50 }}
                            />
                            <TextInput
                                value={password}
                                placeholder={'Password'}
                                password={true}
                                onChangeText={setPassword}
                                autoComplete='password'
                                textContentType={'password'}
                                style={{ width: '80%', height: 50 }}
                                disabled={loading}
                            />
                            <Button
                                title={'Log In!'}
                                disabled={loading}
                                showLoadingSpinner={loading}
                                onPress={loginCallback}
                                style={{ width: '40%', height: 50, marginTop: 10 }}
                            />
                            {errorMessage ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.runwayTextColor }}>{errorMessage}</Text> : null}
                        </View>
                    </KeyboardAvoidingView>

                    <SafeAreaView style={{
                        position: 'absolute',
                        bottom: 0,
                    }} edges={['bottom']}>
                        <Button
                            title={'Don\'t have an account?'}
                            disabled={loading}
                            textColor={theme.runwaySubTextColor}
                            backgroundColor='transparent'
                            onPress={() => navigation.navigate('signup')}
                        />
                    </SafeAreaView>
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    );
};
