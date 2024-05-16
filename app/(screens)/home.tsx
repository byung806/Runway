import { MainButton } from "@/components";
import React from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Debug, Styles } from "@/styles";

import Plane from "@/components/Plane";




export default function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    return (
        <View style={{
            ...Styles.centeredContainer,
            padding: 50
        }}>
            <Plane size={144} />
        </View>
    );
};
