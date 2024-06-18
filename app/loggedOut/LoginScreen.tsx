import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo, OnboardingHeader, Text, TextInput } from '~/2d';

import { Styles } from '@/styles';
import { emailEnding } from '@/utils/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSignInWithEmailAndPassword } from '@skillnation/react-native-firebase-hooks/auth';

export default function LoginScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const { colors } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        if (error) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setErrorMessage('Incorrect password. Please try again!');
            }
            else {
                setErrorMessage('Error logging in. Please try again later!');
            }
        }
    }, [error])

    // called on sign up button press
    function loginCallback() {
        if (username.length == 0) {
            setErrorMessage('Please enter a username!');
            return;
        }
        if (password.length == 0) {
            setErrorMessage('Please enter a password!');
            return;
        }
        signInWithEmailAndPassword(username + emailEnding, password);
    }

    return (
        <View style={{ ...Styles.flex, backgroundColor: colors.background }}>
            <SafeAreaView style={{ ...Styles.centeringContainer, ...Styles.flex }}>
                <OnboardingHeader
                    backgroundColor={colors.background}
                    prevButtonCallback={() => navigation.navigate('start')}
                />

                <View style={{ ...Styles.centeringContainer, margin: 50 }}>
                    <Logo />
                    <Text style={Styles.title}>Welcome Back!</Text>
                    <Text style={Styles.subtitle}>Log in to continue your flight.</Text>
                </View>

                <View style={{ flex: 1, width: '90%' }}>
                    <TextInput
                        placeholder={'Username'}
                        onChangeText={setUsername}
                        style={{ marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder={'Password'}
                        password
                        onChangeText={setPassword}
                        style={{ marginBottom: 10 }}
                    />
                    <Button
                        label={'LOGIN'}
                        disabled={loading}
                        callback={loginCallback}
                    />
                    { errorMessage ? <Text style={{fontSize: 15, textAlign: 'center', marginVertical: 5}}>{errorMessage}</Text> : null }

                    <Text style={{ ...Styles.subtitle, textAlign: 'center', marginVertical: 10 }}>OR</Text>

                    <Button
                        label={'CREATE AN ACCOUNT'}
                        filled={false}
                        disabled={loading}
                        callback={() => navigation.navigate('signup')}
                        style={{ marginBottom: 10 }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
