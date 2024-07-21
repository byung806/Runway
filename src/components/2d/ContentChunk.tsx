import { Styles } from "@/styles";
import { ContentColors, ContentQuestionChoice } from "@/utils/FirebaseProvider";
import { Dimensions, Pressable, View } from "react-native";
import Text from "./Text";
import { ThemeContext } from "./ThemeProvider";
import { useContext } from "react";
import { Button } from "./Button";

export interface TextContentChunkType {
    type?: "text";
    text: string;
}

export function TextContentChunk({ text, colors }: TextContentChunkType & { colors: ContentColors }) {
    return (
        <View style={{ ...Styles.centeringContainer, padding: 20 }}>
            <Text style={{ fontSize: 22, color: colors.textColor, ...Styles.veryLightShadow }}>{text}</Text>
        </View>
    );
}


export interface ParagraphSpacerContentChunkType {
    type?: "paragraphSpacer";
}

export function ParagraphSpacerContentChunk() {
    return (
        <View style={{ height: Dimensions.get("window").height * 0.3 }} />
    );
}


export interface DividerContentChunkType {
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
            <View style={{ flex: 1, backgroundColor: theme.black, borderRadius: 1000 }} />
        </View>
    );
}


export interface QuestionContentChunkType {
    type?: "question";
    question: string;
    choices: ContentQuestionChoice[];
}

export function QuestionContentChunk({ question, choices, colors }: QuestionContentChunkType & { colors: ContentColors }) {
    const theme = useContext(ThemeContext);

    function handleAnswer(selectedAnswer: boolean, index: number) {

    }

    return (
        <View style={{ width: '100%', ...Styles.centeringContainer, padding: 20, gap: 10 }}>
            <Text style={{ fontSize: 30, color: theme.black, ...Styles.lightShadow }}>{question}</Text>
            <View style={{ width: '100%', gap: 10 }}>
                {choices.map((choice, index) => {
                    return (
                        <Pressable
                            onPress={() => handleAnswer(choice.correct, index)}
                            key={index}
                        >
                            <Button title={choice.choice} backgroundColor={colors.textColor} textColor={theme.white} style={{
                                width: '100%',
                                // height: 50,
                            }} />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}