import { Logo, MainButton } from "@/components/screens";
import CustomTextInput from "@/components/screens/CustomTextInput";
import Header from "@/components/screens/start/BackHeader";
import { Styles } from "@/styles";
import { emailEnding, registerUser } from "@/utils/firestore";
import auth from "@react-native-firebase/auth";
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignupScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const { colors } = useTheme();

    const onSignupPress = () => {
        auth()
        .createUserWithEmailAndPassword(username + emailEnding, password)
        .then((response) => {
            console.log('User created!');
            console.log(username, password);
            console.log(response);
            navigation.navigate('app');

            registerUser(username, email, password, response.user.uid);
        })
        .catch(error => {
            alert(error)
        })
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
                    <CustomTextInput
                        placeholder={'Username'}
                        onChangeText={setUsername}
                    />
                    <CustomTextInput
                        placeholder={'Email'}
                        onChangeText={setEmail}
                    />
                    <CustomTextInput
                        placeholder={'Password'}
                        password={true}
                        onChangeText={setPassword}
                    />
                    <MainButton
                        label={'SIGN UP'}
                        callback={onSignupPress}
                    />
                    <Text style={{...Styles.subtitle, textAlign: 'center', marginVertical: 10}}>OR</Text>
                    <MainButton
                        label={'I HAVE AN ACCOUNT'}
                        filled={false}
                        callback={() => navigation.navigate('login')}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
