import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import Button from './Button';

import { Styles } from '@/styles';

interface OnboardingFooterProps {
    backgroundColor: string;
    buttonLabel: string;
    buttonCallback: () => void;
}

export default function OnboardingFooter({ backgroundColor, buttonLabel, buttonCallback }: OnboardingFooterProps) {
    const windowWidth = useWindowDimensions().width;
    const HEIGHT = windowWidth * 0.21;
    const FOOTER_PADDING = windowWidth * 0.05;

    return (
        <View
            style={{
                ...Styles.centeringContainer,
                height: HEIGHT,
                backgroundColor,
                paddingHorizontal: FOOTER_PADDING,
            }}
        >
            <View
                style={{
                    width: '100%',
                    flexDirection: 'column',
                }}
            >
                <Button
                    label={buttonLabel}
                    callback={buttonCallback}
                />
            </View>
        </View>
    );
};
