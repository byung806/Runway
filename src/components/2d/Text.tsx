import { ReactNode, useContext } from 'react';
import { Text as TextNative } from 'react-native';
import { ThemeContext } from './ThemeProvider';

interface TextProps {
    children: ReactNode;
}

export default function Text({ children, ...props }: TextProps & any) {
    const theme = useContext(ThemeContext);
    
    return (
        <TextNative {...props} style={{ fontFamily: 'Inter_800ExtraBold', color: theme.text, ...props.style }}>
            {children?.toString().replace('\\n', '\n')}
        </TextNative>
    );
}