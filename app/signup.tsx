import { Logo } from "@/components/screens";
import Button from '~/Button';

import TextInput from "@/components/screens/TextInput";
import Header from "@/components/screens/start/BackHeader";
import Text from '~/Text';
import { Styles } from "@/styles";
import { emailEnding, registerUser } from "@/utils/firestore";
import auth from "@react-native-firebase/auth";
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreateUserWithEmailAndPassword } from "@skillnation/react-native-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignupScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
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
                <Header
                    backgroundColor={colors.background}
                    prevButtonCallback={() => navigation.navigate('start')}
                />

                <View style={{flex: 3, ...Styles.centeringContainer}}>
                    <Logo />
                    <Text style={Styles.title}>Sign Up!</Text>
                    <Text style={Styles.subtitle}>Create an account to continue your flight.</Text>
                </View>

                <View style={{flex: 2, width: '90%'}}>
                    <TextInput placeholder={'Username'} onChangeText={setUsername} />
                    <TextInput placeholder={'Email'} onChangeText={setEmail} />
                    <TextInput placeholder={'Password'} onChangeText={setPassword} password={true} />
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
