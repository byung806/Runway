import { Audio } from "expo-av";
import { useCallback, useEffect, useState } from "react";

export type PossibleSounds = 'button' | 'quizCorrect' | 'quizWrong';

const soundFiles = {
    button: require('@/assets/sounds/buttonSound.mp3'),
    quizCorrect: require('@/assets/sounds/success.mp3'),
    quizWrong: require('@/assets/sounds/failure.mp3'),
};

export type PlaySoundFunction = () => Promise<void>;

export default function useSound(type: PossibleSounds) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const playSound = useCallback(async () => {
        const { sound } = await Audio.Sound.createAsync(soundFiles[type]);
        setSound(sound);
        await sound.playAsync();
    }, []);

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    return playSound;
};
