import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useTheme } from "@react-navigation/native";
import { Colors, Styles } from '../../styles';

// export const BUTTON_HEIGHT = 45;
export const ANIM_CONFIG = { duration: 30, useNativeDriver: true };

interface MainButtonProps {
    label: string;
    callback: () => void;
    disabled?: boolean;
    filled?: boolean;
}

export default function MainButton({ label, callback, disabled = false, filled = true }: MainButtonProps) {
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
            }}>
                <Text style={{
                    ...Styles.btnLabel,
                    color: '#aaaaaa',
                }}>{label}</Text>
            </View>
        );
    } else {
        return (
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
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
                        ...Styles.btnLabel,
                        color: filled ? Colors.light.white : Colors.light.accent,
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
