import React, { useContext, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';

import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import { Styles } from '@/styles';
import { Content, ContentColors, ContentQuestionChoice } from '@/utils/FirebaseProvider';
import { Button } from './Button';
import { DividerContentChunk, DividerContentChunkType, ParagraphSpacerContentChunk, ParagraphSpacerContentChunkType, QuestionContentChunk, QuestionContentChunkType, TextContentChunk, TextContentChunkType } from './ContentChunk';
import parseContent from '@/utils/ContentParser';
import TodayArrow from './TodayArrow';

interface ContentModalProps {
    completed: boolean;
    date: string;
    content: Content;
    colors: ContentColors;
    closeModal: () => void;
}

export type ContentChunk = TextContentChunkType | ParagraphSpacerContentChunkType | DividerContentChunkType | QuestionContentChunkType;

export default function ContentModal({ completed, date, content, colors, closeModal }: ContentModalProps) {
    const theme = useContext(ThemeContext);

    const [contentChunks, setContentChunks] = useState<ContentChunk[]>(
        parseContent(content)
    );

    // const [currentQuestion, setCurrentQuestion] = useState(0);
    // const [score, setScore] = useState(0);
    // const [showScore, setShowScore] = useState(false);

    // const [buttonColors, setButtonColors] = useState<string[]>([]);
    // const todayQuestions = content.questions;

    // const handleAnswer = async (selectedAnswer: boolean, index: number) => {
    //     const newButtonColors = [...buttonColors];
    //     if (selectedAnswer) {
    //         newButtonColors[index] = 'green';
    //         setScore((prevScore) => prevScore + 1);
    //     } else {
    //         newButtonColors[index] = 'red';
    //     }
    //     setButtonColors(newButtonColors);
    //     await delay(1000);
    //     const nextQuestion = currentQuestion + 1;
    //     newButtonColors[index] = 'white';
    //     setButtonColors(newButtonColors);
    //     if (nextQuestion < todayQuestions.length) {
    //         setCurrentQuestion(nextQuestion);
    //     } else {
    //         setShowScore(true);
    //     }
    // };

    const flatListRef = useRef<FlatList<ContentChunk>>(null);

    function scrollToItem(index: number) {
        flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
    }

    return (
        <View style={{
            flex: 1,
            ...Styles.centeringContainer,
            borderColor: colors.borderColor,
            borderLeftWidth: 6,
            borderRightWidth: 6,
            // borderWidth: 6,
            // borderRadius: 42,
            backgroundColor: colors.backgroundColor,
        }}>
            <FlatList
                ref={flatListRef}
                data={contentChunks}
                renderItem={({ item, index }) => {
                    if (item.type === 'text') {
                        return (
                            <TextContentChunk text={item.text} colors={colors} />
                        );
                    } else if (item.type === 'paragraphSpacer') {
                        return (
                            <ParagraphSpacerContentChunk />
                        );
                    } else if (item.type === 'divider') {
                        return (
                            <DividerContentChunk />
                        );
                    } else if (item.type === 'question') {
                        return (
                            <QuestionContentChunk question={item.question} choices={item.choices} colors={colors} />
                        )
                    }
                    return null;
                }}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={<ContentHeaderComponent content={content} colors={colors} closeModal={closeModal} scrollDownPress={() => { scrollToItem(0) }} />}
                ListFooterComponent={<ContentFooterComponent colors={colors} closeModal={closeModal} />}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate='normal'
            />
        </View>
    )
}

function ContentHeaderComponent({ content, colors, closeModal, scrollDownPress }: { content: Content, colors: ContentColors, closeModal: () => void, scrollDownPress: () => void }) {
    const theme = useContext(ThemeContext);
    const height = Dimensions.get('window').height;

    return (
        <View style={{ height, ...Styles.centeringContainer, gap: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                {content.title}
            </Text>
            <Button
                title='Back'
                backgroundColor={colors.textColor}
                textColor={theme.white}
                onPress={closeModal}
                // reanimatedStyle={{
                //     opacity: cardContentOpacity,
                //     transform: [{ translateY: goTransformY }]
                // }}
                style={{
                    width: '80%',
                    height: 50,
                }}
            />
            <View style={{
                position: 'absolute',
                bottom: 50
            }}>
                {/* TODO: rename TodayArrow to ScrollArrow and replace focusedDate */}
                <TodayArrow side='top' focusedDate={null} onPress={scrollDownPress} />
            </View>
        </View>
    )
}

function ContentFooterComponent({ colors, closeModal }: { colors: ContentColors, closeModal: () => void }) {
    const height = Dimensions.get('window').height;
    const theme = useContext(ThemeContext);

    return (
        <View style={{ height: height, ...Styles.centeringContainer, gap: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                You're all done!
            </Text>
            <Button
                title='Finish'
                backgroundColor={colors.textColor}
                textColor={theme.white}
                onPress={closeModal}
                // reanimatedStyle={{
                //     opacity: cardContentOpacity,
                //     transform: [{ translateY: goTransformY }]
                // }}
                style={{
                    width: '80%',
                    height: 50,
                }}
            />
        </View>
    )
}
