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
    // TODO: day change

    const [focusedDate, setFocusedDate] = useState<string | null>(getTodayDate());
    const [dates, setDates] = useState<DateCardAttributes[]>([]);
    const [loadingDate, setLoadingDate] = useState(false);
    const [reachedEndOfDates, setReachedEndOfDates] = useState(false);

    // TODO: category for colors?
    const outerBackgroundColor = useSharedValue(theme.background);

    // Change background color when theme changes
    useEffect(() => {
        outerBackgroundColor.value = withTiming(theme.background, { duration: 200 });
    }, [theme]);

    // TODO: tap to go up - scroll to index instead of scroll to element

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
        if (loadingDate || reachedEndOfDates) return;

        let newDate;
        if (dates.length === 0) {
            newDate = stringToDate(today);
        } else {
            newDate = stringToDate(dates[dates.length - 1].date);
            newDate.setDate(newDate.getDate() - 1);
        }

        const dateString = newDate.toISOString().split('T')[0];

        setLoadingDate(true);
        const data = await firebase.getContent(dateString);
        setLoadingDate(false);
        if (!data) {
            setReachedEndOfDates(true);
            return;
        }

        setDates([...dates, {
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
    function focusItem(item: DateCardAttributes | null) {
        if (item === null) {
            setFocusedDate(item);
            outerBackgroundColor.value = withTiming(theme.background, { duration: 200 });
        } else {
            setFocusedDate(item.date);
            outerBackgroundColor.value = withTiming(item.colors.outerBackgroundColor, { duration: 200 });
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
            backgroundColor: outerBackgroundColor,
            paddingHorizontal: padding,
        }}>
            <FlatList
                ref={flatListRef}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPressIn={() => {
                            item.ref?.onPressIn();
                            if (focusedDate !== item.date) scrollToItem(index);
                        }} onPressOut={item.ref?.onPressOut}>
                            <DateCard
                                ref={(ref: DateCardRef) => { item.ref = ref }}
                                focused={focusedDate === item.date}
                                completed={false}  // TODO: completed
                                date={item.date}
                                content={item.content}
                                colors={item.colors}
                                style={{
                                    height: boxHeight
                                }}
                            />
                        </Pressable>
                    )
                }}
                data={dates}
                ListHeaderComponent={<ListHeaderComponent height={headerHeight} arrowDown={
                    <TodayArrow side='top' focusedDate={focusedDate} onPress={() => { scrollToItem(0); }} />
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
                        focusItem(viewableItems[0].item);
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
                snapToOffsets={dates.map((_, i) =>
                    (boxHeight + padding) * i
                    + paddingAboveHeader + headerHeight + padding
                    - Dimensions.get("window").height * 0.5 + boxHeight / 2
                )}
                onEndReached={addPreviousDay}
                onEndReachedThreshold={0.9} // how far the user is down the current visible items
            />

            <TodayArrow side='bottom' focusedDate={focusedDate} onPress={() => { scrollToItem(0); }} />
        </Animated.View>
    );
}
