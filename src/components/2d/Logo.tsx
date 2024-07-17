import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated } from '@react-spring/native';
import { Image, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';

const AnimatedView = animated(View);

export default function Logo({ size = 120, animated = true }: { size?: number, animated?: boolean }) {
    const { scale, onPressIn, onPressOut } = useBounceAnimation({});

    function press() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPressIn();
    }

    if (animated) {
        return (
            <Pressable onPressIn={press} onPressOut={onPressOut}>
                <AnimatedView style={{transform: [{scale: scale}]}}>
                    <Image source={require('@/assets/logo.png')} style={{ width: size, height: size }} />
                </AnimatedView>
            </Pressable>
        )
    }
    return (
        <Image source={require('@/assets/logo.png')} style={{ width: size, height: size }} />
    )
}