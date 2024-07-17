import { animated, useSpring } from "@react-spring/native";
import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { ThemeContext } from "./ThemeProvider";

import Book from '@/assets/svg/book.svg';
import Home from '@/assets/svg/home.svg';
import Trophy from '@/assets/svg/trophy.svg';
import useBounceAnimation from "@/utils/useBounceAnimation";
import * as Haptics from 'expo-haptics';
import { useColorScheme, View } from "react-native";

const AnimatedView = animated(View);

export type AnimatedIconRef = {
    onPressIn: () => Promise<void>,
    onPressOut: () => Promise<void>,
}

const AnimatedIcon = forwardRef(({ focused, route, width, height }: { focused: boolean, route: any, width: number, height: number }, ref) => {
    const theme = useContext(ThemeContext);
    const scheme = useColorScheme();

    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.8,
        haptics: Haptics.ImpactFeedbackStyle.Light
    });

    const opacity = useSpring({
        backgroundColor: focused ? theme.accent : '#00000000',
    })

    useImperativeHandle(ref, () => ({
        onPressIn,
        onPressOut,
    }));

    const textColor = scheme === 'light' ?
        (focused ? theme.textInverse : theme.text) :
        (focused ? theme.text : theme.gray);

    return (
        <AnimatedView style={{ transform: [{ scale: scale }] }}>
            <AnimatedView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: width + 20,
                height: height + 20,
                borderRadius: 20,
                backgroundColor: opacity.backgroundColor,
            }}>
                {route.name === 'content' && <Book width={width} height={height} fill={textColor} style={{ elevation: 10 }} />}
                {route.name === 'home' && <Home width={width} height={height} fill={textColor} />}
                {route.name === 'leaderboard' && <Trophy width={width} height={height} fill={textColor} />}
            </AnimatedView>
        </AnimatedView>
    )
});

export default AnimatedIcon;
