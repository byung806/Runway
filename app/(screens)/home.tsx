import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MainScene from "@/components/game/scenes/MainScene";
import { Colors, Styles } from "@/styles";
import Header from "@/components/screens/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function HomeScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any }) {
    const [streak, setStreak] = useState(0);

    const { colors } = useTheme();

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
                        alignItems: 'center',
                    }}
                >
                    <Text style={{
                        color: colors.primary,
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}>byungg</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                        <MaterialCommunityIcons name="fire" size={30} color={colors.primary} />
                        <Text style={{
                            color: colors.primary,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>{streak}</Text>
                    </View>

                    {/* flex: 1, justifyContent: 'flex-end' */}
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            color: colors.primary,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>10000 </Text>
                        <Text style={{
                            color: colors.primary,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>pts</Text>
                    </View> */}

                </View>
            </Header>
            <View style={Styles.flex} {...props}>
                <MainScene referenceSphere={true} />
            </View>
        </>
    );
};
