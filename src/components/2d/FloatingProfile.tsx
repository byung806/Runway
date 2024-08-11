import { ThemeContext, useFirebase } from "@/providers";
import { Styles } from "@/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./Text";

export default function FloatingProfile({ visible }: { visible: boolean }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 600 });
        } else {
            opacity.value = withTiming(0, { duration: 600 });
        }
    }, [visible]);

    return (
        <SafeAreaView style={{
            position: 'absolute',
            top: 0,
            paddingHorizontal: 20,
            zIndex: 100,
            width: '100%',
        }} edges={['top']}>
            <Animated.View style={{
                width: '100%',
                position: 'relative',
                justifyContent: 'space-between',
                flexDirection: 'row',
                opacity: opacity,
            }}>
                {/* <BlackBorder> */}
                <Text style={{ color: theme.runwayTextColor, fontSize: 20, ...Styles.shadow }}>{firebase.userData?.username}</Text>
                {/* </BlackBorder> */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 4 }}>
                    <FontAwesome5 name='fire-alt' size={20} color={'#cc5500'} style={{ ...Styles.shadow }} />
                    <Text style={{ color: '#cc5500', fontSize: 20, ...Styles.shadow }}>{firebase.userData?.streak}</Text>
                </View>
                <Text style={{ color: theme.runwayTextColor, fontSize: 20, ...Styles.shadow }}>{firebase.userData?.points}</Text>
            </Animated.View>
        </SafeAreaView>
    );
}


function BlackBorder({ children }: { children: JSX.Element }) {
    const theme = useContext(ThemeContext);

    return (
        <View style={{
            backgroundColor: theme.black,
            padding: 20,
            height: 60,
            borderRadius: 20,
            ...Styles.shadow,
            ...Styles.centeringContainer,
        }}>
            {children}
        </View>
    );
}