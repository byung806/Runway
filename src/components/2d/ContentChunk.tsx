import { ContentQuestionChoice, ThemeContext, useContent } from "@/providers";
import { Styles } from "@/styles";
import { useContext, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import Button from "./Button";
import Text from "./Text";


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
    side: "left" | "right";
}
export function TextContentChunk({ focused, text, side }: TextContentChunkType) {
    const { colors } = useContent();

    return (
        <BaseContentChunk focused={focused}>
            <Text style={{ fontSize: 22, color: colors.textColor, textAlign: side }}>{text}</Text>
        </BaseContentChunk>
    );
}


export interface TextSpacerContentChunkType extends BaseContentChunkType {
    type?: "textSpacer";
}
export function TextSpacerContentChunk() {
    return (
        <View style={{ height: Dimensions.get("window").height * 0.3 }} />
    );
}


export interface ParagraphSpacerContentChunkType extends BaseContentChunkType {
    type?: "paragraphSpacer";
}
export function ParagraphSpacerContentChunk() {
    return (
        <View style={{ height: Dimensions.get("window").height * 0.2 }} />
    );
}


export interface DividerContentChunkType extends BaseContentChunkType {
    type?: "divider";
}
export function DividerContentChunk() {
    const theme = useContext(ThemeContext);

    return (
        <View style={{
            height: Dimensions.get("window").height * 0.3,
            ...Styles.centeringContainer,
            paddingHorizontal: 20,
        }}>
            {/* <Text style={{ fontSize: 30, color: theme.black }}>Question time!</Text> */}
        </View>
    );
}


export interface QuestionSpacerContentChunkType extends BaseContentChunkType {
    type?: "questionSpacer";
}
export function QuestionSpacerContentChunk() {
    return (
        <View style={{ height: Dimensions.get("window").height * 0.2 }} />
    );
}


export interface QuestionContentChunkType extends BaseContentChunkType {
    type?: "question";
    question: string;
    choices: ContentQuestionChoice[];
    possiblePoints: number;
}
export function QuestionContentChunk({ focused, question, choices, possiblePoints }: QuestionContentChunkType) {
    const theme = useContext(ThemeContext);
    const { isOnboardingContent, colors, cardCompleted, completeQuestion } = useContent();

    const [buttonCompleted, setButtonCompleted] = useState(choices.map(() => false));
    const buttonBackgroundColors = choices.map(() => useSharedValue(colors.textColor));

    const [pointsEarned, setPointsEarned] = useState<number>(0);
    const [done, setDone] = useState(false);

    const opacity = useSharedValue(0);

    function handleAnswer(selectedIndex: number, correct: boolean) {
        for (let i = 0; i < buttonBackgroundColors.length; i++) {
            if (i === selectedIndex) {
                if (buttonCompleted[i]) {
                    return;
                }
                setButtonCompleted(buttonCompleted.map((value, index) => index === selectedIndex ? true : value));
                if (correct) {
                    buttonBackgroundColors[i].value = withTiming(theme.questionCorrectColor, { duration: 200 });

                    let pointsEarned;
                    if (isOnboardingContent) {
                        pointsEarned = possiblePoints;
                    } else {
                        pointsEarned = possiblePoints * (1 - buttonCompleted.filter(x => x === true).length / choices.length);
                    }
                    setPointsEarned(pointsEarned);
                    opacity.value = withTiming(1, { duration: 400 });

                    completeQuestion(pointsEarned, possiblePoints);
                    setDone(true);
                } else {
                    buttonBackgroundColors[i].value = withTiming(theme.questionIncorrectColor, { duration: 200 });
                }
            }
        }
    }

    return (
        <BaseContentChunk focused={focused}>
            <>
                <Text style={{ fontSize: 30, color: colors.textColor, ...Styles.lightShadow }}>{question}</Text>
                <View style={{ width: '100%', gap: 10 }}>
                    {choices.map((choice, index) => {
                        return (
                            <Button
                                key={index}
                                title={choice.choice}
                                disabled={buttonCompleted[index] || done}
                                onPress={() => handleAnswer(index, choice.correct)}
                                textColor={theme.white}
                                forceTextColor={buttonCompleted[index]}
                                sound={choice.correct ? 'quizCorrect' : 'quizWrong'}
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
                {cardCompleted ? null :
                    <Animated.View style={{ opacity: opacity, marginTop: 10 }}>
                        <Text style={{ fontSize: 20, color: colors.textColor, textAlign: 'center' }}>
                            +{Math.round(pointsEarned)}
                        </Text>
                    </Animated.View>
                }
            </>
        </BaseContentChunk>
    );
}