import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MainScene from "@/components/game/scenes/MainScene";
import { Colors, Styles } from "@/styles";
import Header from "@/components/screens/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function HomeScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any }) {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        async function setData() {
            const appData = await AsyncStorage.getItem("streak");
            if (appData == null) {
                setStreak(0);
                AsyncStorage.setItem("streak", "0");
            } else {
                setStreak(parseInt(appData));
            }
        }
        setData();
    }, []);

    return (
        <>
            <Header>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <>
                        <MaterialCommunityIcons name="fire" size={30} color={Colors.light.accent} />
                        <Text style={{
                            color: Colors.light.accent,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>{streak}</Text>
                    </>

                </View>
            </Header>
            <View style={Styles.flex} {...props}>
                <MainScene referenceSphere={true} />
            </View>
        </>
    );
};
