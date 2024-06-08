import { Logo, MainButton } from "@/components/screens";
import CustomTextInput from "@/components/screens/CustomTextInput";
import Header from "@/components/screens/start/BackHeader";
import { Styles } from "@/styles";
import { emailEnding } from "@/utils/firestore";
import auth from "@react-native-firebase/auth";
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LoginScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // TODO: request account data from firestore after login

    const { colors } = useTheme();

    const onLoginPress = () => {
        auth()
        .signInWithEmailAndPassword(username + emailEnding, password)
        .then((response) => {
            console.log('User signed in!');
            console.log(username, password);
            navigation.navigate('app');
        })
        .catch(error => {
            alert(error)
        })
    }

    return (
        <View style={{ ...Styles.flex, backgroundColor: colors.background }}>
            <SafeAreaView style={{...Styles.centeringContainer, ...Styles.flex }}>
                <Header
                    backgroundColor={colors.background}
                    prevButtonCallback={() => navigation.navigate('start')}
                />

                <View style={{flex: 3, ...Styles.centeringContainer}}>
                    <Logo />
                    <Text style={Styles.title}>Welcome Back!</Text>
                    <Text style={Styles.subtitle}>Log in to continue your flight.</Text>
                </View>

                <View style={{flex: 2, width: '90%'}}>
                    <CustomTextInput
                        placeholder={'Username'}
                        onChangeText={setUsername}
                    />
                    <CustomTextInput
                        placeholder={'Password'}
                        password={true}
                        onChangeText={setPassword}
                    />
                    <MainButton
                        label={'LOGIN'}
                        callback={onLoginPress}
                    />
                    <Text style={{...Styles.subtitle, textAlign: 'center', marginVertical: 10}}>OR</Text>
                    <MainButton
                        label={'CREATE AN ACCOUNT'}
                        filled={false}
                        callback={() => navigation.navigate('signup')}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
