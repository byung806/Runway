import { MainButton } from "@/components";
import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Fonts, Styles } from "@/styles";


export default function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    return (
        <View style={{
            ...Styles.centeredContainer,
            padding: 24
        }}>
            <Text style={Fonts.title}>Home</Text>
            <Text style={Fonts.subtitle}>Screen</Text>
            {/* TODO: add timeline */}
        </View>
    );
};
