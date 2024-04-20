import { Logo, MainButton } from "@/components";
import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Styles } from "@/styles";
import { SafeAreaView } from "react-native";


export default function StartScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    return (
        <View style={{ ...Styles.flex, backgroundColor: Colors.light.background }}>
            <SafeAreaView style={{
                ...Styles.centeredContainer,
                ...Styles.flex
            }}>
                <View style={{...Styles.centeredContainer, ...Styles.flex}}>
                    <Logo />
                    <Text style={Styles.title}>Runway</Text>
                </View>
                <View style={{width: "90%"}}>
                    <MainButton
                        label={'GET STARTED'}
                        callback={() => {
                            navigation.navigate('onboarding');
                        }}
                    />
                    <MainButton
                        label={'I HAVE AN ACCOUNT'}
                        callback={() => {
                            navigation.navigate('login');
                        }}
                        filled={false}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
