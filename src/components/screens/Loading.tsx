import { Styles } from "@/styles";
import React, { useEffect } from 'react';
import { Animated, Easing, Image, View } from 'react-native';

export default function Loading({ id = 0, size = 80 }: { id?: number, size?: number }) {
    const animated = new Animated.Value(0);
    const duration = 4000;

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                animated,
                {
                    toValue: 1,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start();
    }, []);

    const spin = animated.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return (
        <View style={{...Styles.flex, ...Styles.centeringContainer}}>
            <Animated.View
                style={{
                    transform: [{ rotate: spin }]
                }}
            >
                <Image
                    source={require('@/assets/planes/plane0.png')}
                    style={{ width: size, height: size }}
                />
            </Animated.View>
        </View>
    )
}