import { useContext } from 'react';
import { Image, Pressable } from 'react-native';
import { ThemeContext } from './ThemeProvider';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

export default function Logo({ size = 120, animated = true }: { size?: number, animated?: boolean }) {
    const theme = useContext(ThemeContext);

    const scale = useSharedValue<number>(1);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    function handlePressIn() {
        scale.value = withSpring(1.2, {
            mass: 0.5,
            damping: 4,
        });
    }

    function handlePressOut() {
        scale.value = withSpring(1, {
            mass: 0.5,
            damping: 4,
        });
    }

    if (animated) {
        return (
            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Animated.View style={animatedStyles}>
                    <Image source={require('@/assets/runwaylogo.png')} style={{ width: size, height: size }} />
                </Animated.View>
            </Pressable>
        )
    }
    return (
        <Image source={require('@/assets/runwaylogo.png')} style={{ width: size, height: size }} />
    )
}