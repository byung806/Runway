import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

import Text from './Text';

export const ANIM_CONFIG = { duration: 30, useNativeDriver: true };

interface ButtonProps {
    label: string;
    callback: () => void;
    disabled?: boolean;
    filled?: boolean;
}

export default function Button({ label, callback, disabled = false, filled = true, ...props }: ButtonProps & any) {
    const theme = useContext(ThemeContext);

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
                    <Animated.View style={{
                        borderRadius: 14,
                        marginBottom: 2,
                        backgroundColor: filled ? theme.accent : theme.white,
                        borderColor: theme.gray,
                        borderWidth: filled ? 0 : 2,
                        padding: 10,
                        ...Styles.centeringContainer,
                        transform: [{ translateY }]
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: filled ? theme.white : theme.black,
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
                            backgroundColor: filled ? theme.accentDarker : theme.gray,
                            marginTop: 2,
                            borderRadius: 14,
                            zIndex: -1,
                            bottom: 0,
                        }} />
                    </View>
                </Pressable>
            </View>
        );
    }
}
