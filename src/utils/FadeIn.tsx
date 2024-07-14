import { animated, useSpring } from "@react-spring/native";
import { View } from "react-native";
import { forwardRef, useImperativeHandle } from "react";

const AnimatedView = animated(View);

export type FadeInRef = {
    start: () => void;
}

interface Props {
    children: any;
    style?: any;
}

const FadeIn = forwardRef<FadeInRef, Props>((props, ref) => {
    const { opacity, startFadeInAnimation } = useFadeInAnimation();

    useImperativeHandle(ref, () => ({
        start: startFadeInAnimation,
    }));

    return (
        <AnimatedView style={{ ...props.style, opacity }}>
            {props.children}
        </AnimatedView>
    );

});

export default FadeIn;

const useFadeInAnimation = () => {
    const [springs, api] = useSpring(() => ({
        from: { opacity: 0 },
    }))

    const start = () => {
        api.start({
            from: {
                opacity: 0,
            },
            to: {
                opacity: 1,
            },
        })
    }

    return {
        opacity: springs.opacity,
        startFadeInAnimation: start,
    };
};
