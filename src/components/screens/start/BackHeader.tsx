import React from 'react';
import { Pressable, View } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { Colors, Styles } from '@/styles';


interface HeaderProps {
    backgroundColor: string;
    prevButtonCallback?: () => void;
}

export default function Header({ backgroundColor, prevButtonCallback }: HeaderProps) {
    return (
        <View
            style={{
                ...Styles.centeredContainer,
                flexDirection: 'row',
                backgroundColor,
                paddingHorizontal: 24,
                paddingVertical: 20
            }}
        >
            <View
                style={{
                    width: '100%',
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
