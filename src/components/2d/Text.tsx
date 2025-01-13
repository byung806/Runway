import { useRunwayTheme } from '@/providers';
import { ReactNode } from 'react';
import { Text as TextNative } from 'react-native';

interface TextProps {
    children: ReactNode;
}

export default function Text({ children, ...props }: TextProps & any) {
    const theme = useRunwayTheme();

    return (
        <TextNative
            {...props}
            ellipsizeMode='tail'
            maxFontSizeMultiplier={1.2}
            adjustsFontSizeToFit={true}
            style={{ fontFamily: 'FredokaOne_400Regular', color: theme.runwayTextColor, ...props.style }}
        >
            {children}
        </TextNative>
    );
}