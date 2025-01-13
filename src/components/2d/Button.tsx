import { useRunwayTheme } from '@/providers';
import { Styles } from '@/styles';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import useBounceAnimation, { SoundType } from '@/utils/useBounceAnimation';
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { animated, config } from '@react-spring/native';
import Text from './Text';

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
    textStyle?: any;
}

const ReactSpringAnimatedView = animated(View);

export default function Button({ title, onPress, backgroundColor, textColor, forceTextColor, disabled = false, showLoadingSpinner = false, sound = 'button', reanimatedStyle, style, textStyle }: ButtonProps) {
    const theme = useRunwayTheme();

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
                borderRadius: 20,
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
                        color: (forceTextColor || !disabled) ? (textColor || theme.runwayButtonTextColor) : '#999999',
                        fontSize: 20, ...Styles.lightShadow, opacity: showLoadingSpinner ? 0 : 1, ...textStyle
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
    const theme = useRunwayTheme();

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


export function IconButton({ type, visible, onPress, style }: { type: 'settings' | 'leaderboard', visible?: boolean, onPress: () => void, style?: any }) {
    const theme = useRunwayTheme();

    const iconColor = type === 'settings' ? theme.white : theme.trophyYellow;
    const icon = type === 'settings' ? (
        <MaterialCommunityIcons name={'cards'} size={30} color={iconColor} />
    ) : (
        <FontAwesome name={'trophy'} size={30} color={iconColor} />
    );
    const side = type === 'settings' ? 'left' : 'right';

    const { scale: buttonScale, onPressIn: buttonOnPressIn, onPress: buttonOnPress, onPressOut: buttonOnPressOut } = useBounceAnimation({
        scaleTo: 0.8,
        haptics: Haptics.ImpactFeedbackStyle.Medium,
        config: config.gentle
    });

    const initialOpacity = 1;
    const opacity = useSharedValue(initialOpacity);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(initialOpacity, { duration: 600 });
            // translateY.value = withTiming(0, { duration: 600 });
        } else {
            opacity.value = withTiming(0.3, { duration: 300 });
            // translateY.value = withTiming(100, { duration: 600 });
        }
    }, [visible]);

    return (
        <Pressable
            android_disableSound={true}
            onPress={() => { buttonOnPress(); onPress(); }}
            onPressIn={buttonOnPressIn}
            onPressOut={buttonOnPressOut}
            style={{ ...Styles.centeringContainer }}
        >
            <Animated.View style={{
                width: '100%',
                position: 'relative',
                justifyContent: 'space-between',
                flexDirection: 'row',
                opacity: opacity,
            }}>
                <ReactSpringAnimatedView style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    bottom: 30,
                    left: side === 'left' ? 20 : undefined,
                    right: side === 'right' ? 20 : undefined,
                    ...style,

                    transform: [{ scale: buttonScale }],

                    height: 60,
                    width: 60,
                    borderRadius: 60,
                    zIndex: 10,
                    backgroundColor: theme.scheme === 'dark' ? theme.black : '#3c0052',
                    ...Styles.shadow,
                    ...Styles.centeringContainer,
                }}>
                    {icon}
                </ReactSpringAnimatedView>
            </Animated.View>
        </Pressable>
    )
}
