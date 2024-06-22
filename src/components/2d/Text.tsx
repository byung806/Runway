import { animated, useSpring } from '@react-spring/native';
import { ReactNode } from 'react';
import { Text as TextNative, TouchableOpacity } from 'react-native';

const AnimatedText = animated(TextNative);

interface TextProps {
    children: ReactNode;
    fadeIn?: boolean;
}

export default function Text({ children, fadeIn = false, ...props }: TextProps & any) {
    if (fadeIn) {
        const [springs, api] = useSpring(() => ({
            from: { opacity: 0.2 },
        }))

        const handleClick = () => {
            console.log('clicked');
            api.start({
                from: {
                    opacity: 0.2,
                },
                to: {
                    opacity: 1,
                },
            })
        }

        return (
            <TouchableOpacity activeOpacity={1.0} onPress={handleClick}>
                <AnimatedText {...props} style={{ fontFamily: 'Silkscreen_400Regular', opacity: springs.opacity, ...props.style }}>
                    {children?.toString().replace('\\n', '\n')}
                </AnimatedText>
            </TouchableOpacity>
        );
    }
    return (
        <AnimatedText {...props} style={{ fontFamily: 'Silkscreen_400Regular', ...props.style }}>
            {children?.toString().replace('\\n', '\n')}
        </AnimatedText>
    );
}