import useBounceAnimation from "@/utils/useBounceAnimation";
import { animated } from "@react-spring/native";
import { Image, Pressable, View } from "react-native";

const AnimatedView = animated(View);

export default function Plane({ id = 0, size = 144, onPress, ...props }: { id?: number, size?: number, onPress?: () => void } & any) {
    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        pressIn: async () => {
            await onPress?.();
        }
    });

    return (
        <View {...props}>
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
                <AnimatedView style={{
                    transform: [{ scale: scale }]
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
        </View>
    )
}