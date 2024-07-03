import { Styles } from "@/styles";
import React, { useContext, useEffect } from "react";
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { ThemeContext } from "./ThemeProvider";

import Book from '@/assets/svg/book.svg';
import Home from '@/assets/svg/home.svg';
import Trophy from '@/assets/svg/trophy.svg';

export default function AnimatedIcon({ focused, route, width, height }: { focused: boolean, route: any, width: number, height: number }) {
    const theme = useContext(ThemeContext);

    const scale = useSharedValue<number>(1);
    const opacity = useSharedValue<number>(0);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedOpacity = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                opacity.value,
                [0, 1],
                ['transparent', theme.accent]
            ),
        };
    });

    useEffect(() => {
        if (focused) {
            opacity.value = withTiming(1);
            scale.value = withSequence(
                withTiming(1.2, {
                    duration: 30,
                    easing: Easing.inOut(Easing.ease),
                }),
                withTiming(1)
            );
        } else {
            console.log('not focused');
            opacity.value = withTiming(0);
            scale.value = withTiming(1);
        }
    }, [focused]);

    return (
        <Animated.View style={animatedScale}>
            <Animated.View style={[{
                width: width + 20,
                height: height + 20,
                borderRadius: 20,
                // elevation: 1,
                ...Styles.centeringContainer,
            }, animatedOpacity]}>
                {route.name === 'content' && <Book width={width} height={height} fill={focused ? theme.textInverse : theme.text} style={{elevation: 10}} />}
                {route.name === 'home' && <Home width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
                {route.name === 'leaderboard' && <Trophy width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
            </Animated.View>
        </Animated.View>
    )
}