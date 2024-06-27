import React from 'react';
import { View } from 'react-native';

import { Styles } from '@/styles';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Logo from './Logo';

export default function Loading({ id = 0, size = 80 }: { id?: number, size?: number }) {
    const opacity = useSharedValue<number>(1);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    // TODO: fade out?

    return (
        <View style={{...Styles.flex, ...Styles.centeringContainer}}>
            <Animated.View
                style={animatedStyles}
            >
                <Logo />
            </Animated.View>
        </View>
    )
}