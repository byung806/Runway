import React from 'react';
import { View } from 'react-native';

import { Styles } from '@/styles';

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
