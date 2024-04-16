import React from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { Colors, Styles } from '@/styles';


interface HeaderProps {
    backgroundColor: string;
    prevButtonCallback?: () => void;
}

export default function Header({ backgroundColor, prevButtonCallback }: HeaderProps) {
    const windowWidth = useWindowDimensions().width;
    const HEIGHT = windowWidth * 0.21;
    const PADDING = windowWidth * 0.08;

    return (
        <View
            style={{
                ...Styles.centeredContainer,
                height: HEIGHT,
                backgroundColor,
                paddingHorizontal: PADDING,
                paddingBottom: 12,
            }}
        >
            <View
                style={{
                    width: '100%',
                    flexDirection: 'column',
                }}
            >
                {prevButtonCallback && (
                    <Pressable onPressIn={prevButtonCallback}>
                        <Icon name="arrow-left" size={30} color={Colors.light.accent} />
                    </Pressable>
                )}
            </View>
        </View>
    );
};
