import { Text as TextNative } from 'react-native';

export default function Text({ children, ...props }: any) {
    return (
        <TextNative {...props} style={{fontFamily: 'Silkscreen_400Regular', ...props.style}}>
            {children}
        </TextNative>
    );
}