import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import MainButton from '../MainButton';
import { Styles } from '@/styles';


interface FooterProps {
    backgroundColor: string;
    buttonLabel: string;
    buttonCallback: () => void;
}

export default function Footer({ backgroundColor, buttonLabel, buttonCallback }: FooterProps) {
    const windowWidth = useWindowDimensions().width;
    const HEIGHT = windowWidth * 0.21;
    const FOOTER_PADDING = windowWidth * 0.05;

    return (
        <View
            style={{
                ...Styles.centeredContainer,
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
                <MainButton
                    label={buttonLabel}
                    callback={buttonCallback}
                />
            </View>
        </View>
    );
};
