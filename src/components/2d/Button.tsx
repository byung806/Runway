import React, { useContext } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

import Text from './Text';

interface ButtonProps {
    label: string;
    callback: () => void;
    disabled?: boolean;
    filled?: boolean;
}

export default function Button({ label, callback, disabled = false, filled = true, ...props }: ButtonProps & any) {
    const theme = useContext(ThemeContext);

    // the number that's going to be animated
    const offset = useSharedValue<number>(-2);

    // how the number that's going to be animated is used in styles
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: offset.value }],
    }));

    function onPressIn() {
        // withTiming starts an animation with the number going to 2
        offset.value = withTiming(2, {
            duration: 30,
            easing: Easing.inOut(Easing.ease),
        });
    }

    function onPressOut() {
        offset.value = withTiming(-2);
        callback();
    }

    if (disabled) {
        return (
            <View style={{
                borderRadius: 14,
                backgroundColor: theme.gray,
                ...Styles.centeringContainer,
                padding: 10,
                ...props.style
            }}>
                <Text style={{
                    fontSize: 15,
                    color: '#aaaaaa',
                }}>{label}</Text>
            </View>
        );
    } else {
        return (
            <View style={props.style}>
                <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
                    <Animated.View style={animatedStyles}>
                        <View style={{
                            ...Styles.centeringContainer,
                            borderRadius: 14,
                            marginBottom: 2,
                            backgroundColor: filled ? theme.accent : theme.white,
                            borderColor: theme.gray,
                            borderWidth: filled ? 0 : 2,
                            padding: 10
                        }}>
                            <Text style={{
                                fontSize: 15,
                                color: filled ? theme.white : theme.black,
                            }}>{label}</Text>
                        </View>
                    </Animated.View>
                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                    }}>
                        <View style={{
                            flex: 1,
                            backgroundColor: filled ? theme.accentDarker : theme.gray,
                            marginTop: 2,
                            borderRadius: 14,
                            zIndex: -1,
                            bottom: 0,
                        }} />
                    </View>
                </Pressable>
            </View >
        );
    }
}
