import { Styles } from "@/styles";
import { ContentColors, ThemeContext } from "@/providers";
import useBounceAnimation from "@/utils/useBounceAnimation";
import { animated, config } from "@react-spring/native";
import { forwardRef, useContext, useImperativeHandle } from "react";
import { View } from "react-native";
import Text from "./Text";

const ReactSpringAnimatedView = animated(View);

export interface BorderedCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const BorderedCard = forwardRef(({ style, colors, newBadge, children }: { style?: any, colors: ContentColors, newBadge?: boolean, children: JSX.Element }, ref) => {
    const theme = useContext(ThemeContext);

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
            position: 'relative',
            overflow: 'hidden',
            transform: [{ scale: cardScale }]
        }}>
            <View style={{
                flex: 1,
                margin: 2,
                borderRadius: 12,
                borderWidth: 6,
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
                ...Styles.centeringContainer,
                overflow: 'hidden',
                // transform: [{ scale: cardScale }]
            }}>
                <>
                    {children}
                </>
            </View>
            {newBadge &&
                <View style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 300,
                    height: 40,
                    backgroundColor: theme.questionIncorrectColor,
                    padding: 5,
                    borderRadius: 5,
                    transform: [{ rotate: '40deg' }, { translateX: 100 }, { translateY: -40 }],
                    ...Styles.lightShadow,
                    ...Styles.centeringContainer
                }}>
                    <Text style={{ color: theme.white, fontSize: 30 }}>New!</Text>
                </View>}
        </ReactSpringAnimatedView>
    );
})

export default BorderedCard;