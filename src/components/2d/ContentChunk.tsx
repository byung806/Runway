import { Styles } from "@/styles";
import { ContentColors, ContentQuestionChoice } from "@/utils/FirebaseProvider";
import { useContext, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Button } from "./Button";
import Plane from "./Plane";
import Text from "./Text";
import { ThemeContext } from "./ThemeProvider";


interface BaseContentChunkType {
    focused: boolean;
}
function BaseContentChunk({ focused, children, style }: { focused: boolean, children: JSX.Element, style?: any }) {
    const [viewed, setViewed] = useState(false);
    const opacity = useSharedValue(focused ? 1 : 0);

    useEffect(() => {
        if (focused) {
            if (!viewed) {
                opacity.value = withTiming(1, { duration: 600 });
            }

            setViewed(true);
        }
    }, [focused]);

    return (
        <Animated.View style={{ ...style, width: '100%', padding: 20, gap: 10, opacity }}>
            {children}
        </Animated.View>
    );
}


export interface TextContentChunkType extends BaseContentChunkType {
    type?: "text";
    text: string;
}
export function TextContentChunk({ focused, text, colors }: TextContentChunkType & { colors: ContentColors }) {
    return (
        <BaseContentChunk focused={focused} style={Styles.centeringContainer}>
            <Text style={{ fontSize: 22, color: colors.textColor }}>{text}</Text>
        </BaseContentChunk>
    );
}


export interface ParagraphSpacerContentChunkType extends BaseContentChunkType {
    type?: "paragraphSpacer";
}
export function ParagraphSpacerContentChunk() {
    return (
        <View style={{ height: Dimensions.get("window").height * 0.3 }} />
    );
}


export interface DividerContentChunkType extends BaseContentChunkType {
    type?: "divider";
}
export function DividerContentChunk() {
    const theme = useContext(ThemeContext);

    return (
        <View style={{
            height: Dimensions.get("window").height * 0.5,
            ...Styles.centeringContainer,
            paddingHorizontal: 20,
        }}>
            {/* <Text style={{ fontSize: 30, color: theme.black }}>Question time!</Text> */}
        </View>
    );
}


export interface QuestionContentChunkType extends BaseContentChunkType {
    type?: "question";
    question: string;
    choices: ContentQuestionChoice[];
}
export function QuestionContentChunk({ focused, question, choices, colors }: QuestionContentChunkType & { colors: ContentColors }) {
    const theme = useContext(ThemeContext);
    const buttonBackgroundColors = choices.map(() => useSharedValue(colors.textColor));

    function handleAnswer(correct: boolean, index: number) {
        for (let i = 0; i < buttonBackgroundColors.length; i++) {
            if (i === index && correct) {
                buttonBackgroundColors[i].value = withTiming(theme.accent, { duration: 200 });
            }
        }
    }

    return (
        <BaseContentChunk focused={focused}>
            <>
                <Text style={{ fontSize: 30, color: theme.black, ...Styles.lightShadow }}>{question}</Text>
                <View style={{ width: '100%', gap: 10 }}>
                    {choices.map((choice, index) => {
                        return (
                            <Button
                                key={index}
                                title={choice.choice}
                                onPress={() => handleAnswer(choice.correct, index)}
                                // backgroundColor={buttonBackgroundColors[index]}
                                textColor={theme.white}
                                style={{
                                    width: '100%',
                                    // height: 50,
                                }}
                                reanimatedStyle={{
                                    backgroundColor: buttonBackgroundColors[index]
                                }}
                            />
                        );
                    })}
                </View>
            </>
        </BaseContentChunk>
    );
}