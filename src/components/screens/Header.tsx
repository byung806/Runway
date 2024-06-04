import React from 'react';
import { View, Text } from 'react-native';
import { Colors, Styles } from '@/styles';


interface HeaderProps {
    backgroundColor?: string;
    children: JSX.Element;
}

export default function Header({ backgroundColor, children }: HeaderProps) {
    return (
        <View
            style={{
                ...Styles.centeringContainer,
                flexDirection: 'row',
                backgroundColor,
                paddingHorizontal: 24,
                paddingVertical: 20
            }}
        >
            {children}
        </View>
    );
};
