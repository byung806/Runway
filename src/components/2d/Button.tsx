import { Styles } from '@/styles';
import * as Haptics from 'expo-haptics';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { ThemeContext } from './ThemeProvider';

import useBounceAnimation, { SoundType } from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import Text from './Text';
import { Audio } from 'expo-av';

interface Button3DProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    filled?: boolean;
}

function Button3D({ title, onPress, disabled = false, filled = true, ...props }: Button3DProps & any) {
    const theme = useContext(ThemeContext);

    // the number that's going to be animated
    const offset = useSharedValue<number>(-2);

    // how the number that's going to be animated is used in styles
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: offset.value }],
    }));

    function onPressIn() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // withTiming starts an animation with the number going to 2
        offset.value = withTiming(2, {
            duration: 30,
            easing: Easing.inOut(Easing.ease),
        });
    }

    function onPressOut() {
        offset.value = withTiming(-2);
        onPress();
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
                }}>{title}</Text>
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
                            }}>{title}</Text>
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



interface ButtonProps {
    title: string;
    onPress: () => void | Promise<void>;
    backgroundColor?: string;
    textColor?: string;
    disabled?: boolean;
    sound?: SoundType;
    reanimatedStyle?: any;
    style?: any;
}

const ReactSpringAnimatedView = animated(View);

export default function Button({ title, onPress, backgroundColor, textColor, disabled = false, sound = 'button', reanimatedStyle, style }: ButtonProps) {
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
                backgroundColor: backgroundColor || (disabled ? theme.gray : theme.runwayButtonColor),
                // transform: [{ translateY: goTransformY }],
                ...(backgroundColor === 'transparent' ? {} : Styles.lightShadow),
                ...reanimatedStyle
            }}>
                <Pressable
                    android_disableSound={true}
                    onPress={disabled ? () => { } : () => { buttonOnPress(); onPress(); }}
                    onPressIn={disabled ? () => { } : buttonOnPressIn}
                    onPressOut={disabled ? () => { } : buttonOnPressOut}
                    style={{ ...Styles.centeringContainer, padding: 10, paddingHorizontal: 20 }}
                >
                    <Text style={{ color: disabled ? '#aaaaaa' : (textColor || theme.runwayTextColor), fontSize: 20, ...Styles.lightShadow }}>{title}</Text>
                </Pressable>
            </Animated.View>
        </ReactSpringAnimatedView>
    );
}

