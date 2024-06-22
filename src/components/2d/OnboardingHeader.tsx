import React, { useContext } from 'react';
import { Pressable, View } from 'react-native';

import ArrowLeft from '@/assets/svg/arrow-left.svg';

import Header from './Header';
import { ThemeContext } from './ThemeProvider';

interface OnboardingHeaderProps {
    backgroundColor?: string;
    prevButtonCallback?: () => void;
}

export default function OnboardingHeader({ backgroundColor, prevButtonCallback }: OnboardingHeaderProps) {
    const theme = useContext(ThemeContext);

    return (
        <Header>
            <View
                style={{
                    width: '100%',
                    backgroundColor: backgroundColor || theme.background,
                }}
            >
                {prevButtonCallback && (
                    <Pressable onPressIn={prevButtonCallback}>
                        <ArrowLeft width={36} height={36} fill={theme.accent} />
                    </Pressable>
                )}
            </View>
        </Header>
    );
};
