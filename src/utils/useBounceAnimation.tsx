import { config as reactSpringConfig, useSpring } from '@react-spring/native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

const useBounceAnimation = ({ pressIn, pressOut, scaleTo = 0.8, haptics, config }: {
    pressIn?: () => Promise<void>,
    pressOut?: () => Promise<void>,
    scaleTo?: number,
    haptics?: Haptics.ImpactFeedbackStyle,
    config?: any
}) => {
    const [active, setActive] = useState(false);

    const { scale } = useSpring({
        scale: active ? scaleTo : 1,
        config: config || reactSpringConfig.wobbly,
    });

    const onPressIn = async () => {
        setActive(true);
        if (haptics) {
            Haptics.impactAsync(haptics);
        }
        await pressIn?.();
    };

    const onPressOut = async () => {
        setActive(false);
        await pressOut?.();
    };

    return {
        scale,
        onPressIn,
        onPressOut,
    };
};

export default useBounceAnimation;