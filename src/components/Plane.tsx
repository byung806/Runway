import { FontAwesome as Icon } from '@expo/vector-icons';
import { Colors, Debug, Styles } from "@/styles";
import { Animated, Image } from 'react-native';
import { useEffect, useRef } from 'react';

export default function Plane({ id = 0, size = 144 }: { id?: number, size?: number }) {
    const animated = new Animated.Value(0);
    const duration = 3000;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animated, {
                    toValue: 20,
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.timing(animated, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    return (
        // <Icon name="paper-plane" size={size} color={Colors.light.accent} />
        <Animated.View
            style={{
                ...Debug.border,
                transform: [{translateY: animated}]
            }}
        >
            <Image
                source={require('@/assets/planes/plane0.png')}
                style={{ width: size, height: size }}
            />
        </Animated.View>

    )
}