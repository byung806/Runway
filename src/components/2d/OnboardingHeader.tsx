import React from 'react';
import { Pressable, View } from 'react-native';

import { FontAwesome as Icon } from '@expo/vector-icons';
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
                        <Icon name="arrow-left" size={30} color={colors.primary} />
                    </Pressable>
                )}
            </View>
        </Header>
    );
};
