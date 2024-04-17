import { Footer, Logo, MainButton } from "@/components";
import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Debug, Styles } from "@/styles";
import { SafeAreaView } from "react-native";


export default function StartScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const windowWidth = useWindowDimensions().width;
    const HEIGHT = windowWidth * 0.21;
    const FOOTER_PADDING = windowWidth * 0.05;

    return (
        <View style={{ ...Styles.flex, backgroundColor: Colors.light.white }}>
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
