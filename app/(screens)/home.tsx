import React from "react";
import { View } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MainScene from "@/components/game/scenes/MainScene";
import { Styles } from "@/styles";


export default function HomeScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any}) {
    return (
        <View style={Styles.flex} {...props}>
            <MainScene referenceSphere={true} />
        </View>
    );
};
