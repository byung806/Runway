import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, TextInput } from 'react-native';

import { Colors, Styles } from '../styles';

export const INPUT_HEIGHT = 45;
export const ANIM_CONFIG = { duration: 30, useNativeDriver: true };

interface CustomTextInputProps {
    placeholder: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    password?: boolean;
}

export default function CustomTextInput({ placeholder, onChangeText, password=false }: CustomTextInputProps) {
    // const translateY = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     animate(-2);
    // }, []);

    // function animate(toValue: 2 | -2) {
    //     Animated.timing(translateY, {
    //         toValue,
    //         ...ANIM_CONFIG,
    //     }).start();
    // }

    // function onPressIn() {
    //     animate(2);
    // }

    // function onPressOut() {
    //     animate(-2);
    //     callback();
    // }
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            secureTextEntry={password}
            style={{
                height: INPUT_HEIGHT,
                borderRadius: 14,
                backgroundColor: Colors.light.white,
                padding: 10,
                borderWidth: 2,
                borderColor: Colors.light.gray,
            }}
        />
    );
}
