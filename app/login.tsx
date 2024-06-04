import { Logo, MainButton } from "@/components/screens";
import { useState } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Styles } from "@/styles";
import CustomTextInput from "@/components/screens/CustomTextInput";
import Header from "@/components/screens/start/BackHeader";

export default function LoginScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { colors } = useTheme();

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
                        callback={() => {
                            console.log('Logging in with:', username, password)
                            navigation.navigate('app')
                        }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
