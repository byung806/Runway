import { ReactNode } from 'react';
import { Text as TextNative } from 'react-native';

interface TextProps {
    children: ReactNode;
}

export default function Text({ children, ...props }: TextProps & any) {
    return (
        <TextNative {...props} style={{ fontFamily: 'Silkscreen_400Regular', ...props.style }}>
            {children?.toString().replace('\\n', '\n')}
        </TextNative>
    );
}