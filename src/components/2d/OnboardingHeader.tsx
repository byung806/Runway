import React, { useContext } from 'react';
import { Pressable, View } from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';

import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

interface OnboardingHeaderProps {
    backgroundColor?: string;
    prevButtonCallback?: () => void;
}

export default function OnboardingHeader({ backgroundColor, prevButtonCallback }: OnboardingHeaderProps) {
    const theme = useContext(ThemeContext);

    return (
        <View
            style={{
                ...Styles.centeringContainer,
                flexDirection: 'row',
                backgroundColor: backgroundColor || theme.background,
                paddingHorizontal: 24,
                paddingVertical: 20,
            }}
        >
            <View
                style={{
                    width: '100%',
                    backgroundColor: backgroundColor || theme.background,
                }}
            >
                {prevButtonCallback && (
                    <Pressable onPressIn={prevButtonCallback}>
                        <AntDesign name="arrowleft" size={36} color={theme.accent} />
                    </Pressable>
                )}
            </View>
        </View>
    );
};
