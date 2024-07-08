import { animated, config, useSpring } from "@react-spring/native";
import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { ThemeContext } from "./ThemeProvider";

import Book from '@/assets/svg/book.svg';
import Home from '@/assets/svg/home.svg';
import Trophy from '@/assets/svg/trophy.svg';
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

const AnimatedView = animated(View);

export type AnimatedIconRef = {
    setActive: (active: boolean) => void;
}

const AnimatedIcon = forwardRef(({ focused, route, width, height }: { focused: boolean, route: any, width: number, height: number }, ref) => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation();

    const [active, setActive] = useState(false);
    const springs = useSpring({
        scale: active ? 1.2 : 1,
        config: config.wobbly,
    })

    const opacity = useSpring({
        backgroundColor: focused ? theme.accent : '#00000000',
    })

    useImperativeHandle(ref, () => ({
        setActive,
    }));

    return (
        <AnimatedView style={{ transform: [{ scale: springs.scale }] }}>
            <AnimatedView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: width + 20,
                height: height + 20,
                borderRadius: 20,
                backgroundColor: opacity.backgroundColor,
            }}>
                {route.name === 'content' && <Book width={width} height={height} fill={focused ? theme.textInverse : theme.text} style={{ elevation: 10 }} />}
                {route.name === 'home' && <Home width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
                {route.name === 'leaderboard' && <Trophy width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
            </AnimatedView>
        </AnimatedView>
    )
});

export default AnimatedIcon;
