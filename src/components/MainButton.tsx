import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';

import { Colors, Styles } from '../styles';

export const BUTTON_HEIGHT = 45;
export const ANIM_CONFIG = { duration: 30, useNativeDriver: true };

interface MainButtonProps {
    label: string;
    callback: () => void;
    disabled?: boolean;
    filled?: boolean;
}

export default function MainButton({ label, callback, disabled = false, filled = true }: MainButtonProps) {
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
            <View style={styles.mainDisabledButton}>
                <Text style={styles.btnDisabledLabel}>{label}</Text>
            </View>
        );
    } else {
        return (
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
                <View style={styles.outsideView}>
                    <Animated.View style={[filled ? styles.filledMainButton : styles.unfilledMainButton, { transform: [{ translateY }] }]}>
                        <Text style={filled ? styles.filledLabel : styles.unfilledLabel}>{label}</Text>
                    </Animated.View>
                    <View style={filled ? styles.filledBackground : styles.unfilledBackground} />
                </View>
            </Pressable>
        );
    }
}

const styles = StyleSheet.create({
    mainDisabledButton: {
        height: BUTTON_HEIGHT,
        borderRadius: 14,
        backgroundColor: Colors.light.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDisabledLabel: {
        ...Styles.btnLabel,
        color: '#aaaaaa',
    },
    outsideView: {
        height: BUTTON_HEIGHT,
    },
    filledBackground: {
        backgroundColor: Colors.light.accentDarker,
        width: '100%',
        height: BUTTON_HEIGHT - 2,
        borderRadius: 14,
        position: 'absolute',
        zIndex: -1,
        bottom: 0,
    },
    unfilledBackground: {
        backgroundColor: Colors.light.gray,
        width: '100%',
        height: BUTTON_HEIGHT - 2,
        borderRadius: 14,
        position: 'absolute',
        zIndex: -1,
        bottom: 0,
    },
    filledMainButton: {
        height: BUTTON_HEIGHT - 2,
        borderRadius: 14,
        backgroundColor: Colors.light.accent,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unfilledMainButton: {
        height: BUTTON_HEIGHT - 2,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.light.gray,
        backgroundColor: Colors.light.white,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filledLabel: {
        ...Styles.btnLabel,
        color: Colors.light.white,
    },
    unfilledLabel: {
        ...Styles.btnLabel,
        color: Colors.light.accent,
    }
});