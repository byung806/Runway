import { ThemeContext, useFirebase } from "@/providers";
import { Styles } from "@/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from '@react-native-community/blur';
import React, { useContext, useEffect } from "react";
import { Platform, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./Text";

export default function FloatingProfile({ visible }: { visible: boolean }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const initialOpacity = 1;

    const opacity = useSharedValue(initialOpacity);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(initialOpacity, { duration: 600 });
            // translateY.value = withTiming(0, { duration: 600 });
        } else {
            opacity.value = withTiming(0.3, { duration: 300 });
            // translateY.value = withTiming(-100, { duration: 600 });
        }
    }, [visible]);

    return (
        <>
            <SafeAreaView style={{
                position: 'absolute',
                top: 0,
                paddingHorizontal: 20,
                zIndex: 2,
                width: '100%',
                pointerEvents: 'none',
            }} edges={['top']}>
                <Animated.View style={{
                    width: '100%',
                    position: 'relative',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    opacity: opacity,
                    transform: [{ translateY: translateY }],
                }}>
                    <Text style={{ color: theme.runwayTextColor, fontSize: 20, ...Styles.shadow }}>{firebase.userData?.username}</Text>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 4 }}>
                        <FontAwesome5 name='fire-alt' size={20} color={firebase.userData?.streak === 0 ? theme.inactiveStreakColor : theme.streakColor} style={{ ...Styles.shadow }} />
                        <Text style={{ color: firebase.userData?.streak === 0 ? theme.inactiveStreakColor : theme.streakColor, fontSize: 20, ...Styles.shadow }}>{firebase.userData?.streak}</Text>
                    </View>
                    <Text style={{ color: theme.runwayTextColor, fontSize: 20, ...Styles.shadow }}>{firebase.userData?.points}</Text>
                </Animated.View>
            </SafeAreaView>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 90,
                    zIndex: 1,
                    opacity: opacity,
                    pointerEvents: 'none',
                    transform: [{ translateY: translateY }],
                }}
            >
                {Platform.OS === 'ios' &&
                    <BlurView
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        blurType={theme.scheme === 'dark' ? "ultraThinMaterialDark" : "thinMaterialLight"}
                        blurAmount={10}
                        // overlayColor="black"
                        reducedTransparencyFallbackColor="black"
                    />
                }
            </Animated.View>
        </>
    );
}
