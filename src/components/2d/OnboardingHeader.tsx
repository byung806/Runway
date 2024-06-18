import React from 'react';
import { Pressable, View } from 'react-native';

import { FontAwesome as Icon } from '@expo/vector-icons';
import ArrowLeft from '@/assets/svg/arrow-left.svg';
import { useTheme } from '@react-navigation/native';

import Header from './Header';

interface OnboardingHeaderProps {
    backgroundColor: string;
    prevButtonCallback?: () => void;
}

export default function OnboardingHeader({ backgroundColor, prevButtonCallback }: OnboardingHeaderProps) {
    const { colors } = useTheme();

    return (
        <Header>
            <View
                style={{
                    width: '100%',
                }}
            >
                {prevButtonCallback && (
                    <Pressable onPressIn={prevButtonCallback}>
                        <ArrowLeft width={36} height={36} fill={colors.primary} />
                    </Pressable>
                )}
            </View>
        </Header>
    );
};
