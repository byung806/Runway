import { config as reactSpringConfig, useSpring } from '@react-spring/native';
import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const useBounceAnimation = ({ pressIn, pressOut, scaleTo = 0.8, haptics, config, doSound, doQuizSoundCorrect, doQuizSoundWrong }: {
    pressIn?: () => Promise<void>,
    pressOut?: () => Promise<void>,
    scaleTo?: number,
    haptics?: Haptics.ImpactFeedbackStyle,
    config?: any
    doSound?: boolean
    doQuizSoundCorrect?: boolean
    doQuizSoundWrong?: boolean
}) => {
    const [sound, setSound] = useState<Audio.Sound>();

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/buttonSound.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    async function playQuizSoundCorrect() {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/success.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    async function playQuizSoundWrong() {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/failure.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync();
        }
            : undefined;
    }, [sound])

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

        if (doSound) {
            playSound();
        }

        if (doQuizSoundCorrect) {
            playQuizSoundCorrect();
        }

        if (doQuizSoundWrong) {
            playQuizSoundWrong();
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