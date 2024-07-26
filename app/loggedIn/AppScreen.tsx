import { DateCard, DateCardRef, ListFooterComponent, ListHeaderComponent, ThemeContext, TodayArrow } from '@/components/2d';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable } from 'react-native';

import { getTodayDate, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';


interface DateCardAttributes {
    ref: DateCardRef | null;
    date: string;
    content: Content;
    colors: ContentColors;
}

export default function AppScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const today = getTodayDate();

    async function triggerStreakScreen() {
        navigation.navigate('streak');
    }

    async function requestCompleteToday() {
        const { dataChanged } = await firebase.requestCompleteToday();
        console.log('dataChanged', dataChanged);
        if (dataChanged) {
            await triggerStreakScreen();
            await firebase.getUserData();
            await firebase.getLeaderboard('global');
            // TODO: update friends leaderboard too if rank is ever implemented
        }
    }

    const [cards, setCards] = useState<DateCardAttributes[]>([]);
    const [focusedCard, setFocusedCard] = useState<{
        index: number | null,
        date: string | null
    }>({
        index: null,
        date: null
    });

    const [currentlyAddingCard, setCurrentlyAddingCard] = useState(false);
    const [allContentLoaded, setAllContentLoaded] = useState(false);

    // TODO: category for colors?
    const initialBackgroundColor = theme.runwayBackgroundColor;
    const backgroundColor = useSharedValue(initialBackgroundColor);

    // Change background color when theme changes
    useEffect(() => {
        backgroundColor.value = withTiming(initialBackgroundColor, { duration: 200 });
    }, [theme]);
    
    const flatListRef = useRef<FlatList<DateCardAttributes>>(null);

    const paddingAboveHeader = 50;
    const headerHeight = Dimensions.get("window").height * 0.8;
    const padding = 30;
    const boxWidth = Dimensions.get("window").width - padding * 2;
    const boxHeight = boxWidth * 1.6;
    const footerHeight = Dimensions.get("window").height * 0.8;

    /**
     * Add previous day to the list, adding a new card below the last one
     */
    async function addPreviousDay() {
        if (currentlyAddingCard || allContentLoaded) return;

        let newDate;
        if (cards.length === 0) {
            newDate = stringToDate(today);
        } else {
            newDate = stringToDate(cards[cards.length - 1].date);
            newDate.setDate(newDate.getDate() - 1);
        }

        const dateString = newDate.toISOString().split('T')[0];

        setCurrentlyAddingCard(true);
        const data = await firebase.getContent(dateString);
        setCurrentlyAddingCard(false);
        if (!data) {
            setAllContentLoaded(true);
            return;
        }

        setCards([...cards, {
            date: dateString,
            ref: null,
            content: data.content,
            colors: data.colors
        }]);
    }

    /**
     * Update background and attributes when focused item changes
     * Called when item comes into view
     */
    function focusItem(index: number | null) {
        if (index === null) {
            setFocusedCard({
                index: null,
                date: null
            });
            backgroundColor.value = withTiming(initialBackgroundColor, { duration: 200 });
        } else {
            setFocusedCard({
                index,
                date: cards[index].date
            })
            backgroundColor.value = withTiming(cards[index].colors.outerBackgroundColor, { duration: 200 });
        }
    }

    /**
     * Scroll to card with index
     */
    function scrollToItem(index: number) {
        flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
    }

    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: backgroundColor,
            paddingHorizontal: padding,
        }}>
            <FlatList
                ref={flatListRef}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPressIn={() => {
                            item.ref?.onPressIn();
                            if (focusedCard.date !== item.date) scrollToItem(index);
                        }} onPressOut={item.ref?.onPressOut}>
                            <DateCard
                                ref={(ref: DateCardRef) => { item.ref = ref }}
                                focused={focusedCard.date === item.date}
                                completed={false}  // TODO: completed
                                date={item.date}
                                content={item.content}
                                colors={item.colors}
                                requestCompleteToday={requestCompleteToday}
                                style={{
                                    height: boxHeight
                                }}
                            />
                        </Pressable>
                    )
                }}
                data={cards}
                ListHeaderComponent={<ListHeaderComponent height={headerHeight} arrowDown={
                    <TodayArrow side='top' focusedDate={focusedCard.date} onPress={() => { scrollToItem(0); }} />
                } />}
                ListFooterComponent={<ListFooterComponent height={footerHeight} />}
                getItemLayout={(_, index) => {
                    return {
                        length: boxHeight + padding,
                        offset: (boxHeight + padding) * index + (paddingAboveHeader + headerHeight + padding),
                        index
                    }
                }}
                keyExtractor={(item) => item.date}
                numColumns={1}
                onViewableItemsChanged={({ viewableItems }) => {
                    if (viewableItems.length === 0) {
                        // focus header or footer or between items
                        focusItem(null);
                    } else {
                        focusItem(viewableItems[0].index);
                    }
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 75,  // how much of the item is visible
                    waitForInteraction: false
                }}
                contentContainerStyle={{ gap: padding, paddingTop: paddingAboveHeader }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate='fast'
                snapToOffsets={cards.map((_, i) =>
                    (boxHeight + padding) * i
                    + paddingAboveHeader + headerHeight + padding
                    - Dimensions.get("window").height * 0.5 + boxHeight / 2
                )}
                onEndReached={addPreviousDay}
                onEndReachedThreshold={0.9} // how far the user is down the current visible items
            />

            <TodayArrow side='bottom' focusedDate={focusedCard.date} onPress={() => { scrollToItem(0); }} />
        </Animated.View>
    );
}
