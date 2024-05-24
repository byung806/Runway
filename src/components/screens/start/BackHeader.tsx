import React from 'react';
import { Pressable, View } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { Colors, Styles } from '@/styles';
import Header from '../Header';


interface BackHeaderProps {
    backgroundColor: string;
    prevButtonCallback?: () => void;
}

export default function BackHeader({ backgroundColor, prevButtonCallback }: BackHeaderProps) {
    return (
        <Header>
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
        </Header>
    );
};
