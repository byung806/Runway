import { Styles } from "@/styles";
import { ContentColors } from "@/providers";
import useBounceAnimation from "@/utils/useBounceAnimation";
import { animated, config } from "@react-spring/native";
import { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";

const ReactSpringAnimatedView = animated(View);

export interface BorderedCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const BorderedCard = forwardRef(({ style, colors, children }: { style: any, colors: ContentColors, children: JSX.Element }, ref) => {
    const { scale: cardScale, onPressIn: cardOnPressIn, onPressOut: cardOnPressOut } = useBounceAnimation({
        scaleTo: 0.94,
        config: config.gentle
    });

    useImperativeHandle(ref, () => ({
        onPressIn: cardOnPressIn,
        onPressOut: cardOnPressOut,
    }));

    return (
        <ReactSpringAnimatedView style={{
            ...style,
            flex: 1,
            borderRadius: 12,
            borderWidth: 6,
            borderColor: colors.borderColor,
            backgroundColor: colors.backgroundColor,
            ...Styles.centeringContainer,
            transform: [{ scale: cardScale }]
        }}>
            {children}
        </ReactSpringAnimatedView>
    );
})

export default BorderedCard;