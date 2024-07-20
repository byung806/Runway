import React, { useContext, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "./ThemeProvider";

import { getTodayDate, getYesterdayDate } from "@/utils/date";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Styles } from "@/styles";

interface TodayArrowProps {
    side: 'top' | 'bottom';
    focusedDate: string | null;
    onPress: () => void;
}

const today = getTodayDate();
const yesterday = getYesterdayDate();

export default function TodayArrow({ side, focusedDate, onPress }: TodayArrowProps) {
    if (side === 'top') {
        return (
            <Arrow side={side} focusedDate={focusedDate} onPress={onPress} />
        )
    }
    if (side === 'bottom') {
        return (
            <SafeAreaView style={{
                position: 'absolute',
                justifyContent: 'flex-end',
                padding: 8,
                alignSelf: 'center',
                pointerEvents: (!focusedDate || focusedDate === today) ? 'none' : 'auto',
            }} edges={['top']}>
                <Arrow side={side} focusedDate={focusedDate} onPress={onPress} />
            </SafeAreaView>
        )
    }
}

function Arrow({ side, focusedDate, onPress }: TodayArrowProps) {
    const theme = useContext(ThemeContext);

    const todayButtonOpacity = useSharedValue(side === 'top' ? 1 : 0);
    const todayButtonTransformY = useSharedValue(0);
    const todayButtonScale = useSharedValue(1);

    useEffect(() => {
        if (side === 'bottom') {
            if (focusedDate === null || focusedDate === today || focusedDate === yesterday) {
                todayButtonOpacity.value = withTiming(0, { duration: 200 });
                todayButtonTransformY.value = withTiming(-80, { duration: 200 });
            } else {
                todayButtonOpacity.value = withTiming(1, { duration: 1000 });
                todayButtonTransformY.value = withTiming(0, { duration: 1000 });
            }
        } else {
            if (focusedDate !== null) {
                todayButtonOpacity.value = withTiming(0, { duration: 300 });            
            } else {
                todayButtonOpacity.value = withTiming(1, { duration: 200 });
            }
        }
    }, [focusedDate]);

    return (
        <Animated.View style={{
            height: 40,
            width: 40,
            borderRadius: 1000,
            padding: 4,
            backgroundColor: theme.black,
            ...Styles.shadow,
            opacity: todayButtonOpacity,
            ...Styles.centeringContainer,
            transform: [{ translateY: todayButtonTransformY }, { scale: todayButtonScale }]
        }}>
            <Pressable
                onPress={() => {
                    todayButtonScale.value = withSequence(withSpring(0.6, { duration: 400 }), withSpring(1, { duration: 200 }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onPress();
                }}
            >
                <AntDesign name={side === 'top' ? 'arrowdown' : 'arrowup'} size={30} color={theme.white} />
            </Pressable>
        </Animated.View>
    )
}