import { Styles } from '@/styles';
import React from 'react';
import { View } from 'react-native';


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
