import { Logo, MainButton } from "@/components";
import { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Styles } from "@/styles";
import CustomTextInput from "@/components/CustomTextInput";
import Header from "@/components/start/BackHeader";


export default function LoginScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={{ ...Styles.flex, backgroundColor: Colors.light.background }}>
            <SafeAreaView style={{...Styles.centeredContainer, ...Styles.flex }}>
                <Header
                    backgroundColor={Colors.light.background}
                    prevButtonCallback={() => navigation.navigate('start')}
                />

                <View style={{flex: 3, ...Styles.centeredContainer}}>
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
