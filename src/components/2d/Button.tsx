import { ThemeContext } from '@/providers/ThemeProvider';
import { Styles } from '@/styles';
import * as Haptics from 'expo-haptics';
import React, { useContext } from 'react';
import { Pressable, View } from 'react-native';
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
    sound?: SoundType;
    reanimatedStyle?: any;
    style?: any;
}

const ReactSpringAnimatedView = animated(View);

export default function Button({ title, onPress, backgroundColor, textColor, forceTextColor, disabled = false, sound = 'button', reanimatedStyle, style }: ButtonProps) {
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
                // flex: 1,
                borderRadius: 12,
                // opacity: cardContentOpacity,
                backgroundColor: disabled ? '#bbbbbb' : backgroundColor || theme.runwayButtonColor,
                // transform: [{ translateY: goTransformY }],
                ...(backgroundColor === 'transparent' ? {} : Styles.lightShadow),
                ...reanimatedStyle,
            }}>
                <Pressable
                    android_disableSound={true}
                    onPress={disabled ? () => { } : () => { buttonOnPress(); onPress(); }}
                    onPressIn={disabled ? () => { } : buttonOnPressIn}
                    onPressOut={disabled ? () => { } : buttonOnPressOut}
                    style={{ ...Styles.centeringContainer, padding: 10, paddingHorizontal: 20 }}
                >
                    <Text style={{
                        color: (forceTextColor || !disabled) ? (textColor || theme.runwayTextColor) : '#999999',
                        fontSize: 20, ...Styles.lightShadow
                    }}>{title}</Text>
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