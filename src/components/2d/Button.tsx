import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Colors, Styles } from '@/styles';
import { useTheme } from '@react-navigation/native';

import Text from './Text';

// export const BUTTON_HEIGHT = 45;
export const ANIM_CONFIG = { duration: 30, useNativeDriver: true };

interface ButtonProps {
    label: string;
    callback: () => void;
    disabled?: boolean;
    filled?: boolean;
}

export default function Button({ label, callback, disabled = false, filled = true, ...props }: ButtonProps & any) {
    const { colors } = useTheme();

    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animate(-2);
    }, []);

    function animate(toValue: 2 | -2) {
        Animated.timing(translateY, {
            toValue,
            ...ANIM_CONFIG,
        }).start();
    }

    function onPressIn() {
        animate(2);
    }

    function onPressOut() {
        animate(-2);
        callback();
    }

    if (disabled) {
        return (
            <View style={{
                borderRadius: 14,
                backgroundColor: Colors.light.gray,
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
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={props.style}>
                <Animated.View style={{
                    borderRadius: 14,
                    marginBottom: 2,
                    backgroundColor: filled ? Colors.light.accent : Colors.light.white,
                    borderColor: Colors.light.gray,
                    borderWidth: filled ? 0 : 2,
                    padding: 10,
                    ...Styles.centeringContainer,
                    transform: [{ translateY }]
                }}>
                    <Text style={{
                        fontSize: 15,
                        color: filled ? Colors.light.white : Colors.light.black,
                    }}>{label}</Text>
                </Animated.View>
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: filled ? Colors.light.accentDarker : Colors.light.gray,
                        marginTop: 2,
                        borderRadius: 14,
                        zIndex: -1,
                        bottom: 0,
                    }} />
                </View>
            </Pressable>
        );
    }
}
