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
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    // TODO: validate form inputs

    useEffect(() => {
        // useEffect tracks changes in [user] variable
        if (user) {
            navigation.navigate('app');
        }
    }, [user]);

    if (error) {
        alert(error);
    }

    return (
        <View style={{ ...Styles.flex, backgroundColor: colors.background }}>
            <SafeAreaView style={{ ...Styles.centeringContainer, ...Styles.flex }}>
                <OnboardingHeader
                    backgroundColor={colors.background}
                    prevButtonCallback={() => navigation.goBack()}
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
                        callback={() => signInWithEmailAndPassword(username + emailEnding, password)}
                    />
                    <Text style={{ ...Styles.subtitle, textAlign: 'center', marginVertical: 10 }}>OR</Text>
                    <Button
                        label={'CREATE AN ACCOUNT'}
                        filled={false}
                        disabled={loading}
                        callback={() => navigation.navigate('signup')}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
