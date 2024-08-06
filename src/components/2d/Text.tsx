import { ThemeContext } from '@/providers';
import { ReactNode, useContext } from 'react';
import { Text as TextNative } from 'react-native';

interface TextProps {
    children: ReactNode;
}

export default function Text({ children, ...props }: TextProps & any) {
    const theme = useContext(ThemeContext);
    
    return (
        <TextNative {...props} ellipsizeMode='tail' style={{ fontFamily: 'Inter_800ExtraBold', color: theme.text, ...props.style }}>
            {children}
        </TextNative>
    );
}