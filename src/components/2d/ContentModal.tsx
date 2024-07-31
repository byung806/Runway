import React, { useContext, useRef, useState } from 'react';
import { Dimensions, FlatList, Modal, View } from 'react-native';

import { Styles } from '@/styles';
import parseContent from '@/utils/ContentParser';
import { Content, ContentColors } from '@/utils/FirebaseProvider';
import Button from './Button';
import { DividerContentChunk, DividerContentChunkType, ParagraphSpacerContentChunk, ParagraphSpacerContentChunkType, QuestionContentChunk, QuestionContentChunkType, TextContentChunk, TextContentChunkType } from './ContentChunk';
import ScrollArrow from './ScrollArrow';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import { useContent } from './ContentProvider';

export type ContentChunk = TextContentChunkType | ParagraphSpacerContentChunkType | DividerContentChunkType | QuestionContentChunkType;

export default function ContentModal({ visible }: { visible: boolean }) {
    const { content, colors, earnablePointsWithoutStreak } = useContent();

    const [contentChunks, setContentChunks] = useState<ContentChunk[]>(
        parseContent(content, earnablePointsWithoutStreak)  // TODO: memo
    );

    const [focusedItems, setFocusedItems] = useState<number[]>([]);

    const flatListRef = useRef<FlatList<ContentChunk>>(null);

    function scrollToItem(index: number) {
        flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
    }

    return (
        <Modal visible={visible} animationType='slide'>
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
                        const focused = focusedItems.includes(index);
                        if (item.type === 'text') {
                            return (
                                <TextContentChunk
                                    focused={focused}
                                    text={item.text}
                                />
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
                                <QuestionContentChunk
                                    focused={focused}
                                    question={item.question}
                                    choices={item.choices}
                                    possiblePoints={item.possiblePoints}
                                />
                            )
                        }
                        return null;
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={<ContentHeaderComponent scrollDownPress={() => { scrollToItem(0) }} />}
                    ListFooterComponent={<ContentFooterComponent />}
                    numColumns={1}
                    onViewableItemsChanged={({ viewableItems }) => {
                        const focusedIndexes = viewableItems.map((item) => item.index).filter((index) => typeof index === 'number');
                        setFocusedItems(focusedIndexes);
                    }}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 80,  // how much of the item is visible
                        waitForInteraction: false
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate='normal'
                />
            </View>
        </Modal>
    )
}

function ContentHeaderComponent({ scrollDownPress }: { scrollDownPress: () => void }) {
    const theme = useContext(ThemeContext);
    const { isOnboardingContent, content, colors, back } = useContent();

    const [arrowVisible, setArrowVisible] = useState(true);

    const height = Dimensions.get('window').height;

    return (
        <View style={{ height, ...Styles.centeringContainer, padding: 20, gap: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                {content.title}
            </Text>
            {!isOnboardingContent &&
                <Button
                    title='Back'
                    backgroundColor={colors.textColor}
                    textColor={theme.white}
                    onPress={back}
                    style={{
                        width: '80%',
                        height: 50,
                    }}
                />
            }
            <View style={{
                position: 'absolute',
                bottom: 50
            }}>
                <ScrollArrow type='down' visible={arrowVisible} onPress={() => { scrollDownPress(); setArrowVisible(false); }} />
            </View>
        </View>
    )
}

function ContentFooterComponent() {
    const height = Dimensions.get('window').height;
    const theme = useContext(ThemeContext);
    const { isOnboardingContent, cardCompleted, colors, allQuestionsCompleted, finish } = useContent();

    const [loading, setLoading] = useState(false);

    async function onPress() {
        setLoading(true);
        await finish();
        setLoading(false);
    }

    return (
        <View style={{ height: height, ...Styles.centeringContainer, padding: 20, gap: 20 }}>
            {allQuestionsCompleted ?
                <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                    {isOnboardingContent ? 'You\'re done! Let\'s see how many points you earned.' : 'You\'re all done!'}
                </Text>
                :
                <Text style={{ textAlign: 'center', fontSize: 35, color: colors.textColor }}>
                    Complete all the questions to finish!
                </Text>}
            <Button
                title='Finish'
                backgroundColor={colors.textColor}
                textColor={theme.white}
                onPress={onPress}
                disabled={!allQuestionsCompleted || loading}
                style={{
                    width: '80%',
                    height: 50,
                }}
            />
            {cardCompleted &&
                <Text style={{ textAlign: 'center', fontSize: 20, color: colors.textColor }}>You've already completed this card!</Text>
            }
        </View>
    )
}
