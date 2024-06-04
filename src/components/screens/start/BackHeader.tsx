import React from 'react';
import { Pressable, View } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { Colors, Styles } from '@/styles';
import Header from '../Header';
import { useTheme } from "@react-navigation/native";


interface BackHeaderProps {
    backgroundColor: string;
    prevButtonCallback?: () => void;
}

export default function BackHeader({ backgroundColor, prevButtonCallback }: BackHeaderProps) {
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
