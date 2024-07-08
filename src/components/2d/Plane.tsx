import { View, Image, Pressable } from "react-native";
import { useSpring, animated, config } from "@react-spring/native";
import { useState } from "react";

const AnimatedView = animated(View);

export default function Plane({ id = 0, size = 144, onPress }: { id?: number, size?: number, onPress?: () => void}) {
    const [active, setActive] = useState(false);

    const springs = useSpring({
        scale: active ? 1.2 : 1,
        config: config.wobbly,
    })

    async function onPressIn() {
        setActive(true);
        await onPress?.();
    }

    return (
        <Pressable onPressIn={onPressIn} onPressOut={() => {setActive(false)}}>
            <AnimatedView style={{
                transform: [{ scale: springs.scale }]
            }}>
                <Image
                    source={require('@/assets/planes/plane0.png')}
                    style={{
                        width: size,
                        height: size,
                    }}
                />
            </AnimatedView>
        </Pressable>
    )
}