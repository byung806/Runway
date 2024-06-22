import React, { useContext } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Button from './Button';

import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

interface OnboardingFooterProps {
    backgroundColor?: string;
    buttonLabel: string;
    buttonCallback: () => void;
}

export default function OnboardingFooter({ backgroundColor, buttonLabel, buttonCallback }: OnboardingFooterProps) {
    const theme = useContext(ThemeContext);
    
    const windowWidth = useWindowDimensions().width;
    const HEIGHT = windowWidth * 0.21;
    const FOOTER_PADDING = windowWidth * 0.05;

    return (
        <View
            style={{
                ...Styles.centeringContainer,
                height: HEIGHT,
                backgroundColor: backgroundColor || theme.background,
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
