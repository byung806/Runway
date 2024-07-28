import React, { useContext, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "./ThemeProvider";

import { Styles } from "@/styles";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';

interface ScrollArrowProps {
    type: 'upFloating' | 'down';
    visible: boolean;
    onPress: () => void;
}

export default function ScrollArrow({ type, visible, onPress }: ScrollArrowProps) {
    if (type === 'down') {
        return (
            <Arrow type={type} visible={visible} onPress={onPress} />
        )
    }
    if (type === 'upFloating') {
        return (
            <SafeAreaView style={{
                position: 'absolute',
                justifyContent: 'flex-end',
                padding: 8,
                alignSelf: 'center',
                // pointerEvents: (!focusedDate || focusedDate === today) ? 'none' : 'auto',
                pointerEvents: visible ? 'auto' : 'none',
            }} edges={['top']}>
                <Arrow type={type} visible={visible} onPress={onPress} />
            </SafeAreaView>
        )
    }
}

function Arrow({ type, visible, onPress }: ScrollArrowProps) {
    const theme = useContext(ThemeContext);

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

    // useEffect(() => {
    //     if (type === 'up') {
    //         if (focusedDate === null || focusedDate === today || focusedDate === yesterday) {
    //             arrowOpacity.value = withTiming(0, { duration: 200 });
    //             arrowTransformY.value = withTiming(-80, { duration: 200 });
    //         } else {
    //             arrowOpacity.value = withTiming(1, { duration: 1000 });
    //             arrowTransformY.value = withTiming(0, { duration: 1000 });
    //         }
    //     } else {
    //         if (focusedDate !== null) {
    //             arrowOpacity.value = withTiming(0, { duration: 300 });            
    //         } else {
    //             arrowOpacity.value = withTiming(1, { duration: 200 });
    //         }
    //     }
    // }, [focusedDate]);

    return (
        <Animated.View style={{
            height: 40,
            width: 40,
            borderRadius: 1000,
            padding: 4,
            backgroundColor: theme.black,
            ...Styles.shadow,
            opacity: arrowOpacity,
            ...Styles.centeringContainer,
            transform: [{ translateY: arrowTransformY }, { scale: arrowScale }]
        }}>
            <Pressable
                onPress={() => {
                    arrowScale.value = withSequence(withSpring(0.6, { duration: 400 }), withSpring(1, { duration: 200 }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onPress();
                }}
            >
                <AntDesign name={type === 'upFloating' ? 'arrowup' : 'arrowdown'} size={30} color={theme.white} />
            </Pressable>
        </Animated.View>
    )
}