import { ThemeContext } from '@/providers/ThemeProvider';
import { Styles } from '@/styles';
import * as Haptics from 'expo-haptics';
import React, { useContext } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import useBounceAnimation, { SoundType } from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import Text from './Text';
import { FontAwesome } from "@expo/vector-icons";

interface ButtonProps {
    title: string;
    onPress: () => void | Promise<void>;
    backgroundColor?: string;
    textColor?: string;
    forceTextColor?: boolean;
    disabled?: boolean;
    showLoadingSpinner?: boolean;
    sound?: SoundType;
    reanimatedStyle?: any;
    style?: any;
}

const ReactSpringAnimatedView = animated(View);

export default function Button({ title, onPress, backgroundColor, textColor, forceTextColor, disabled = false, showLoadingSpinner = false, sound = 'button', reanimatedStyle, style }: ButtonProps) {
    const theme = useContext(ThemeContext);

    const { scale: buttonScale, onPressIn: buttonOnPressIn, onPress: buttonOnPress, onPressOut: buttonOnPressOut } = useBounceAnimation({
        scaleTo: 0.9,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle,
        playSound: sound
    });

    return (
        <ReactSpringAnimatedView style={{
            // width: '80%',
            // height: 50,
            alignSelf: 'center',
            transform: [{ scale: buttonScale }],
            ...style
        }}>
            <Animated.View style={{
                borderRadius: 12,
                // opacity: cardContentOpacity,
                backgroundColor: disabled ? (backgroundColor === 'transparent' ? 'transparent' : '#bbbbbb') : backgroundColor || theme.runwayButtonColor,
                // transform: [{ translateY: goTransformY }],
                ...(backgroundColor === 'transparent' ? {} : Styles.lightShadow),
                ...reanimatedStyle,
            }}>
                <Pressable
                    android_disableSound={true}
                    onPress={disabled ? null : () => { buttonOnPress(); onPress(); }}
                    onPressIn={disabled ? null : buttonOnPressIn}
                    onPressOut={disabled ? null : buttonOnPressOut}
                    style={{ ...Styles.centeringContainer, padding: 10, paddingHorizontal: 20 }}
                >
                    <Text style={{
                        color: (forceTextColor || !disabled) ? (textColor || theme.runwayTextColor) : '#999999',
                        fontSize: 20, ...Styles.lightShadow, opacity: showLoadingSpinner ? 0 : 1
                    }}>{title}</Text>

                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, ...Styles.centeringContainer }}>
                        <ActivityIndicator color={theme.black} style={{
                            opacity: showLoadingSpinner ? 1 : 0,
                        }} />
                    </View>
                </Pressable>
            </Animated.View>
        </ReactSpringAnimatedView>
    );
}


export function CloseButton({ color, onPress }: { color?: string, onPress: () => void }) {
    const theme = useContext(ThemeContext);

    return (
        <Animated.View style={{
            height: 40,
            width: 40,
        }}>
            <Pressable onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onPress();
            }}>
                <FontAwesome name={'close'} size={30} color={color || theme.black} />
            </Pressable>
        </Animated.View>
    )
}


export function LeaderboardButton({ onPress }: { onPress: () => void }) {
    const theme = useContext(ThemeContext);

    const { scale: buttonScale, onPressIn: buttonOnPressIn, onPress: buttonOnPress, onPressOut: buttonOnPressOut } = useBounceAnimation({
        scaleTo: 0.8,
        haptics: Haptics.ImpactFeedbackStyle.Heavy,
        config: config.gentle
    });

    return (
        <Pressable
            android_disableSound={true}
            onPress={() => { buttonOnPress(); onPress(); }}
            onPressIn={buttonOnPressIn}
            onPressOut={buttonOnPressOut}
            style={{ ...Styles.centeringContainer }}
        >
            <ReactSpringAnimatedView style={{
                alignSelf: 'center',
                position: 'absolute',
                bottom: 30,
                left: 20,
                // @ts-ignore
                transform: [{ scale: buttonScale }],

                height: 60,
                width: 60,
                borderRadius: 20,
                backgroundColor: theme.black,
                ...Styles.shadow,
                ...Styles.centeringContainer,
            }}>
                <FontAwesome name={'trophy'} size={30} color={theme.trophyYellow} />
            </ReactSpringAnimatedView>
        </Pressable>
    )
}