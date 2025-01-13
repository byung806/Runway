import { useRunwayTheme } from "@/providers";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Styles } from "@/styles";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';


interface ScrollArrowProps {
    type: 'upFloating' | 'up' | 'down';
    visible: boolean;
    onPress: () => void;
}

export function ScrollArrow({ type, visible, onPress }: ScrollArrowProps) {
    if (type === 'down') {
        return (
            <Arrow filled type={type} visible={visible} onPress={onPress} />
        )
    }
    if (type === 'up') {
        return (
            <Arrow filled type={type} visible={visible} onPress={onPress} />
        )
    }
    if (type === 'upFloating') {
        return (
            <SafeAreaView style={{
                position: 'absolute',
                justifyContent: 'flex-end',
                padding: 8,
                alignSelf: 'center',
                pointerEvents: visible ? 'auto' : 'none',
            }} edges={['top']}>
                <Arrow filled type={type} visible={visible} onPress={onPress} />
            </SafeAreaView>
        )
    }
}


export function BackArrow({ color, onPress }: { color?: string, onPress: () => void }) {
    return <Arrow color={color} filled={false} type='left' visible={true} onPress={onPress} />
}


interface ArrowProps {
    filled: boolean;
    color?: string;
    type: 'upFloating' | 'up' | 'down' | 'left' | 'right';
    visible: boolean;
    onPress: () => void;
}

function Arrow({ filled, color, type, visible, onPress }: ArrowProps) {
    const theme = useRunwayTheme();

    const arrowOpacity = useSharedValue(type === 'upFloating' ? 0 : 1);
    const arrowTransformY = useSharedValue(0);
    const arrowScale = useSharedValue(1);

    useEffect(() => {
        if (type === 'upFloating') {
            if (visible) {
                arrowOpacity.value = withTiming(1, { duration: 200 });
                arrowTransformY.value = withTiming(0, { duration: 200 });
            } else {
                arrowOpacity.value = withTiming(0, { duration: 200 });
                arrowTransformY.value = withTiming(-80, { duration: 200 });
            }
        } else if (type === 'down') {
            if (visible) {
                arrowOpacity.value = withTiming(1, { duration: 200 });
            } else {
                arrowOpacity.value = withTiming(0, { duration: 200 });
            }
        }
    }, [visible]);

    return (
        <Animated.View style={{
            height: 40,
            width: 40,
            borderRadius: 1000,
            padding: 4,
            backgroundColor: filled ? theme.black : 'transparent',
            ...(filled ? Styles.shadow : {}),
            opacity: arrowOpacity,
            ...Styles.centeringContainer,
            pointerEvents: visible ? 'auto' : 'none',
            transform: [{ translateY: arrowTransformY }, { scale: arrowScale }]
        }}>
            <Pressable
                onPress={() => {
                    arrowScale.value = withSequence(withSpring(0.6, { duration: 400 }), withSpring(1, { duration: 200 }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onPress();
                }}
            >
                <AntDesign name={
                    type === 'upFloating' ? 'arrowup' :
                        type === 'up' ? 'arrowup' :
                            type === 'down' ? 'arrowdown' :
                                type === 'left' ? 'arrowleft' :
                                    type === 'right' ? 'arrowright' : 'arrowdown'
                } size={30} color={color || (filled ? theme.white : theme.black)} />
                {/* <MaterialIcons name={
                    type === 'upFloating' ? 'keyboard-arrow-up' :
                        type === 'up' ? 'keyboard-arrow-up' :
                            type === 'down' ? 'keyboard-arrow-down' :
                                type === 'left' ? 'keyboard-arrow-left' :
                                    type === 'right' ? 'keyboard-arrow-right' : 'keyboard-arrow-down'
                } size={40} olor={color || (filled ? theme.white : theme.black)} /> */}
            </Pressable>
        </Animated.View>
    )
}