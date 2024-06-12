import { Logo } from "@/components/screens";
import Button from '~/Button';

import Text from '~/Text';
import { Styles } from "@/styles";
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const { colors } = useTheme();
    return (
        <View style={{ ...Styles.flex, backgroundColor: colors.background }}>
            <SafeAreaView style={{
                ...Styles.centeringContainer,
                ...Styles.flex
            }}>
                <Text>Hello</Text>
                <View style={{...Styles.centeringContainer, ...Styles.flex}}>
                    <Logo />
                    <Text style={Styles.title}>Runway</Text>
                </View>
                <View style={{width: "90%"}}>
                    <Button
                        label={'GET STARTED'}
                        callback={() => {
                            navigation.navigate('onboarding');
                        }}
                    />
                    <Button
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
