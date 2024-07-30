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

interface ContentModalProps {
    visible: boolean;
    closeModal: () => void;
    onboarding?: boolean;
    cardCompleted: boolean;
    date: string;
    content: Content;
    colors: ContentColors;
    requestCompleteDate: (date?: string) => Promise<void>;
}

export type ContentChunk = TextContentChunkType | ParagraphSpacerContentChunkType | DividerContentChunkType | QuestionContentChunkType;

export default function ContentModal({ visible, closeModal, onboarding, cardCompleted, date, content, colors, requestCompleteDate }: ContentModalProps) {
    const [contentChunks, setContentChunks] = useState<ContentChunk[]>(
        parseContent(content)
    );

    const [focusedItems, setFocusedItems] = useState<number[]>([]);

    const flatListRef = useRef<FlatList<ContentChunk>>(null);

    function scrollToItem(index: number) {
        flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
    }

    async function finish() {
        if (!cardCompleted && !onboarding) {  // don't need this since requestCompleteDate in AppScreen already checks if date is completed, but just in case
            await requestCompleteDate(date);
        }
        closeModal();
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
                                <TextContentChunk focused={focused} text={item.text} colors={colors} />
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
                                <QuestionContentChunk focused={focused} question={item.question} choices={item.choices} colors={colors} />
                            )
                        }
                        return null;
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={<ContentHeaderComponent content={content} colors={colors} onboarding={onboarding} closeModal={closeModal} scrollDownPress={() => { scrollToItem(0) }} />}
                    ListFooterComponent={<ContentFooterComponent colors={colors} cardCompleted={cardCompleted} onboarding={onboarding} finish={finish} />}
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

function ContentHeaderComponent({ content, colors, onboarding, closeModal, scrollDownPress }: { content: Content, colors: ContentColors, onboarding?: boolean, closeModal: () => void, scrollDownPress: () => void }) {
    const theme = useContext(ThemeContext);
    const height = Dimensions.get('window').height;

    return (
        <View style={{ height, ...Styles.centeringContainer, gap: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                {content.title}
            </Text>
            {!onboarding &&
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
            }
            <View style={{
                position: 'absolute',
                bottom: 50
            }}>
                <ScrollArrow type='down' visible={true} onPress={scrollDownPress} />
            </View>
        </View>
    )
}

function ContentFooterComponent({ colors, cardCompleted, onboarding, finish }: { colors: ContentColors, cardCompleted: boolean, onboarding?: boolean, finish: () => Promise<void> }) {
    const height = Dimensions.get('window').height;
    const theme = useContext(ThemeContext);

    const [disabled, setDisabled] = useState(false);

    async function onPress() {
        setDisabled(true);

        // TODO: get question score and make that determine points added
        await finish();
        setDisabled(false);
    }

    return (
        <View style={{ height: height, ...Styles.centeringContainer, gap: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                { onboarding ? 'You\'re done! Let\'s see how many points you earned.' : 'You\'re all done!' }
            </Text>
            <Button
                title='Finish'
                backgroundColor={colors.textColor}
                textColor={theme.white}
                onPress={onPress}
                disabled={disabled}
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
