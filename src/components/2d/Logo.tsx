import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated } from '@react-spring/native';
import { Image, Pressable, View } from 'react-native';

const AnimatedView = animated(View);

export default function Logo({ size = 120, animated = true }: { size?: number, animated?: boolean }) {
    const { scale, onPressIn, onPressOut } = useBounceAnimation({});

    if (animated) {
        return (
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
                <AnimatedView style={{transform: [{scale: scale}]}}>
                    <Image source={require('@/assets/runwaylogo.png')} style={{ width: size, height: size }} />
                </AnimatedView>
            </Pressable>
        )
    }
    return (
        <Image source={require('@/assets/runwaylogo.png')} style={{ width: size, height: size }} />
    )
}