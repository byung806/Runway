import { config as reactSpringConfig, useSpring } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import useSound, { PlaySoundFunction, PossibleSounds } from './useSound';

export type SoundType = undefined | 'none' | PossibleSounds;

// TODO: sound settings
const useBounceAnimation = ({ pressIn, press, pressOut, scaleTo = 0.8, haptics, config, playSound }: {
    pressIn?: () => Promise<void>,
    press?: () => Promise<void>,
    pressOut?: () => Promise<void>,
    scaleTo?: number,
    haptics?: Haptics.ImpactFeedbackStyle,
    config?: any,
    playSound?: SoundType
}) => {
    // let playButtonSound: PlaySoundFunction;
    // let playQuizSoundCorrect: PlaySoundFunction;
    // let playQuizSoundWrong: PlaySoundFunction;
    // if (playSound === 'button') { playButtonSound = useSound('button'); }
    // if (playSound === 'quizCorrect') { playQuizSoundCorrect = useSound('quizCorrect'); }
    // if (playSound === 'quizWrong') { playQuizSoundWrong = useSound('quizWrong'); }

    const [active, setActive] = useState(false);

    const { scale } = useSpring({
        scale: active ? scaleTo : 1,
        config: config || reactSpringConfig.wobbly,
    });

    const onPressIn = async () => {
        setActive(true);
        await pressIn?.();

    };

    const onPress = async () => {
        if (haptics) {
            Haptics.impactAsync(haptics);
        }

        // if (playSound === 'button') {
        //     await playButtonSound();
        // }
        // if (playSound === 'quizCorrect') {
        //     await playQuizSoundCorrect();
        // }
        // if (playSound === 'quizWrong') {
        //     await playQuizSoundWrong();
        // }
        await press?.();
    }

    const onPressOut = async () => {
        setActive(false);
        await pressOut?.();
    };

    return {
        scale,
        onPressIn,
        onPress,
        onPressOut,
    };
};

export default useBounceAnimation;