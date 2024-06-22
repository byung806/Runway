import React, { useContext } from 'react';
import { View } from 'react-native';

import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

interface HeaderProps {
    backgroundColor?: string;
    children: JSX.Element;
}

export default function Header({ backgroundColor, children }: HeaderProps) {
    const theme = useContext(ThemeContext);

    return (
        <View
            style={{
                ...Styles.centeringContainer,
                flexDirection: 'row',
                backgroundColor: backgroundColor || theme.background,
                paddingHorizontal: 24,
                paddingVertical: 20,
            }}
        >
            {children}
        </View>
    );
};
