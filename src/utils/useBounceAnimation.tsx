import { config as reactSpringConfig, useSpring } from '@react-spring/native';
import { useState } from 'react';

const useBounceAnimation = ({pressIn, pressOut, config}: {pressIn?: () => Promise<void>, pressOut?: () => Promise<void>, config?: any}) => {
    const [active, setActive] = useState(false);

    const { scale } = useSpring({
        scale: active ? 1.2 : 1,
        config: config || reactSpringConfig.wobbly,
    });

    const onPressIn = async () => {
        setActive(true);
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