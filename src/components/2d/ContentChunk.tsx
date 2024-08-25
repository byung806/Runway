import { FirebaseContentQuestionChoice, ThemeContext, useContent } from "@/providers";
import { Styles } from "@/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import Button from "./Button";
import Text from "./Text";


export type ContentChunkType = TextContentChunkType | ImageContentChunkType | IconContentChunkType | QuestionContentChunkType | EmptySpaceContentChunkType;
export function ContentChunk({ focused, chunk }: { focused: boolean, chunk: ContentChunkType }) {
    switch (chunk.type) {
        case "text":
            return <TextContentChunk focused={focused} text={chunk.text} side={chunk.side} />;
        case "image":
            return <ImageContentChunk focused={focused} uri={chunk.uri} />;
        case "icon":
            return <IconContentChunk focused={focused} icon={chunk.icon} />;
        case "question":
            return <QuestionContentChunk focused={focused} question={chunk.question} choices={chunk.choices} possiblePoints={chunk.possiblePoints} />;
        case "empty":
            return <EmptySpaceContentChunk focused={focused} fractionOfScreen={chunk.fractionOfScreen} />;
        default:
            return null;
    }
}

interface BaseContentChunkType {
    focused: boolean;
}
function BaseContentChunk({ focused, children, style }: { children: JSX.Element, style?: any } & BaseContentChunkType) {
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
        <Animated.View style={{ ...style, width: '100%', paddingHorizontal: 20, gap: 10, opacity }}>
            {children}
        </Animated.View>
    );
}


export interface TextContentChunkType {
    type?: "text";
    text: string;
    side: "left" | "right";
}
export function TextContentChunk({ focused, text, side }: TextContentChunkType & BaseContentChunkType) {
    const { colors } = useContent();

    return (
        <BaseContentChunk focused={focused} style={{ paddingVertical: Dimensions.get("window").height * 0.15 }}>
            <Text style={{ fontSize: 22, color: colors.textColor, textAlign: side }}>{text}</Text>
        </BaseContentChunk>
    );
}


export interface ImageContentChunkType {
    type?: "image";
    uri: string;
}
export function ImageContentChunk({ focused, uri }: ImageContentChunkType & BaseContentChunkType) {
    const [aspectRatio, setAspectRatio] = useState(1);
    Image.getSize(uri, (width, height) => { setAspectRatio(width / height); });

    return (
        <BaseContentChunk focused={focused} style={{ paddingVertical: Dimensions.get("window").height * 0.15 }}>
            <Image
                source={{ uri }}
                style={{ width: '100%', aspectRatio: aspectRatio, borderRadius: 20 }}
                resizeMode='contain'
            />
        </BaseContentChunk>
    );
}


export interface IconContentChunkType {
    type?: "icon";
    icon: string;
}
export function IconContentChunk({ focused, icon }: IconContentChunkType & BaseContentChunkType) {
    const { colors } = useContent();

    return (
        <BaseContentChunk focused={focused} style={{ paddingVertical: Dimensions.get("window").height * 0.1 }}>
            <FontAwesome5 name={icon} size={40} color={colors.textColor} />
        </BaseContentChunk>
    );
}


export interface QuestionContentChunkType {
    type?: "question";
    question: string;
    choices: FirebaseContentQuestionChoice[];
    possiblePoints: number;
}
export function QuestionContentChunk({ focused, question, choices, possiblePoints }: QuestionContentChunkType & BaseContentChunkType) {
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
        <BaseContentChunk focused={focused} style={{ paddingVertical: Dimensions.get("window").height * 0.15 }}>
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

export interface EmptySpaceContentChunkType {
    type?: "empty";
    fractionOfScreen: number;
}
export function EmptySpaceContentChunk({ focused, fractionOfScreen }: EmptySpaceContentChunkType & BaseContentChunkType) {
    return (
        <BaseContentChunk focused={focused}>
            <View style={{ height: Dimensions.get("window").height * fractionOfScreen }} />
        </BaseContentChunk>
    );
}