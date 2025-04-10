import React, { useContext, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Linking, Modal, Pressable, View } from 'react-native';

import { ThemeContext, useContent } from '@/providers';
import { Styles } from '@/styles';
import parseContent from '@/utils/ContentParser';
import { stringToDate } from '@/utils/date';
import Foundation from '@expo/vector-icons/Foundation';
import { ScrollArrow } from './Arrow';
import Button, { CloseButton } from './Button';
import CategoryIcon from './CategoryIcon';
import { ContentChunk, ContentChunkType } from './ContentChunk';
import Text from './Text';


//TODO: only show 1 question at a time

export default function ContentModal({ visible }: { visible: boolean }) {
    const { content, colors, earnablePointsWithoutStreak } = useContent();

    const [contentChunks, setContentChunks] = useState<ContentChunkType[]>(
        useMemo(() => parseContent(content, earnablePointsWithoutStreak), [content])
    );

    // console.log(JSON.stringify(contentChunks, undefined, 2));

    const [focusedItems, setFocusedItems] = useState<number[]>([]);

    const flatListRef = useRef<FlatList<ContentChunkType>>(null);

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
                    style={{ width: '100%' }}
                    data={contentChunks}
                    renderItem={({ item, index }) => {
                        const focused = focusedItems.includes(index);
                        return (
                            <ContentChunk focused={focused} chunk={item} />
                        )
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
                        itemVisiblePercentThreshold: 70,  // how much of the item is visible
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
    const { isOnboardingContent, isToday, date, content, colors, questionsStarted, back } = useContent();

    const [arrowVisible, setArrowVisible] = useState(true);

    const height = Dimensions.get('window').height;

    const dateObject = stringToDate(date);
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const day = dateObject.getDate();

    return (
        <View style={{ height, ...Styles.centeringContainer, gap: 20 }}>
            {!isOnboardingContent && !questionsStarted &&
                <View style={{
                    position: 'absolute',
                    top: 60,
                    left: 20,
                    justifyContent: 'space-between',
                }}>
                    <CloseButton color={colors.textColor} onPress={back} />
                </View>
            }

            <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor, paddingHorizontal: 20 }}>
                {content.title}
            </Text>

            {!isNaN(day) &&
                <Text style={{ textAlign: 'center', fontSize: 20, color: colors.textColor }}>
                    {isToday ? 'Today' : `from ${month} ${day}`}
                </Text>
            }

            <View
                style={{
                    backgroundColor: theme.black,
                    height: 2,
                    width: 165,
                    // alignSelf: 'stretch',
                }}
            />

            <CategoryIcon category={content.category} size={40} color={colors.textColor} />

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
    const { isOnboardingContent, isToday, content, cardCompleted, colors, earnedPointsWithoutStreak, earnedStreakBonus, earnablePointsWithoutStreak, allQuestionsCompleted, finish } = useContent();

    const [loading, setLoading] = useState(false);

    async function onPress() {
        setLoading(true);
        await finish();
        setLoading(false);
    }

    return (
        <View style={{ height: height, ...Styles.centeringContainer, padding: 20, gap: 20 }}>
            {allQuestionsCompleted || cardCompleted ?
                <Text style={{ textAlign: 'center', fontSize: 40, color: colors.textColor }}>
                    You're all done!
                </Text>
                :
                <Text style={{ textAlign: 'center', fontSize: 35, color: colors.textColor }}>
                    You have uncompleted questions!
                </Text>}
            {!cardCompleted && allQuestionsCompleted && !isToday &&
                <>
                    <Text style={{ textAlign: 'center', fontSize: 20, color: colors.textColor }}>Points Earned: +{Math.round(earnedPointsWithoutStreak)}</Text>
                    {isToday && <Text style={{ textAlign: 'center', fontSize: 20, color: colors.textColor }}>Streak Bonus: +{Math.round(earnedStreakBonus)}</Text>}
                </>
            }
            {cardCompleted && !allQuestionsCompleted &&
                <Text style={{ textAlign: 'center', fontSize: 20, color: colors.textColor }}>You only earn points for cards you haven't done before!</Text>
            }
            <Button
                title={cardCompleted ? 'Continue' : 'Get Points!'}
                backgroundColor={colors.textColor}
                textColor={theme.white}
                onPress={onPress}
                disabled={(!allQuestionsCompleted || loading) && !cardCompleted}
                showLoadingSpinner={loading}
                style={{
                    width: '80%',
                    height: 50,
                }}
            />

            {content.author &&
                <View style={{
                    position: 'absolute',
                    bottom: 50,
                    gap: 30
                }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: colors.textColor }}>
                        This lesson created by {content.author}
                    </Text>
                </View>
            }
        </View>
    )
}
