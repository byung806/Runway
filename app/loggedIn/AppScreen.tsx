import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { DateCard, DateCardRef, ListFooterComponent, ListHeaderComponent, Text, ThemeContext } from '@/components/2d';

import { Styles } from '@/styles';
import { getTodayDate, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StackNavigationProp } from '@react-navigation/stack';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


const ReactSpringAnimatedView = animated(View);

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

    const [focusedDate, setFocusedDate] = useState<string | null>(getTodayDate());
    const [dates, setDates] = useState<DateCardAttributes[]>([]);
    const [loadingDate, setLoadingDate] = useState(false);
    const [reachedEndOfDates, setReachedEndOfDates] = useState(false);

    const todayButtonTransformY = useSharedValue(0);
    const todayButtonOpacity = useSharedValue(0);
    const outerBackgroundColor = useSharedValue(theme.background);
    const goButtonColor = useSharedValue('transparent');
    const goButtonOpacity = useSharedValue(0);

    // for GO button
    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.9,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.wobbly
    });

    // Change background color when theme changes
    useEffect(() => {
        outerBackgroundColor.value = withTiming(theme.background, { duration: 200 });
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
        if (item === null || item.date === today) {
            todayButtonOpacity.value = withTiming(0, { duration: 200 });
            todayButtonTransformY.value = withTiming(-50, { duration: 200 });
        } else {
            todayButtonOpacity.value = withTiming(1, { duration: 1000 });
            todayButtonTransformY.value = withTiming(0, { duration: 1000 });
        }

        if (item === null) {
            setFocusedDate(item);
            outerBackgroundColor.value = withTiming(theme.background, { duration: 200 });
            goButtonColor.value = withTiming('transparent', { duration: 200 });
            goButtonOpacity.value = withTiming(0, { duration: 200 });
        } else {
            setFocusedDate(item.date);
            outerBackgroundColor.value = withTiming(item.colors.outerBackgroundColor, { duration: 200 });
            goButtonColor.value = withTiming(item.colors.textColor, { duration: 200 });
            goButtonOpacity.value = withTiming(1, { duration: 200 });
        }
    }

    /**
     * Scroll to card with index
     */
    async function scrollToItem(index: number) {
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
                ListHeaderComponent={<ListHeaderComponent height={headerHeight} />}
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

            {/* middle clickable go button */}
            <ReactSpringAnimatedView style={{
                position: 'absolute',
                width: 220,
                height: 50,
                alignSelf: 'center',
                top: '65%',
                pointerEvents: !focusedDate ? 'none' : 'auto',
                transform: [{ scale: scale }]
            }}>
                <Animated.View style={{
                    flex: 1,
                    borderRadius: 12,
                    opacity: goButtonOpacity,
                    backgroundColor: goButtonColor,
                }}>
                    <Pressable
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={{ flex: 1, ...Styles.centeringContainer }}
                    >
                        <Text style={{ color: theme.text, fontSize: 20 }}>Go!</Text>
                    </Pressable>
                </Animated.View>
            </ReactSpringAnimatedView>

            {/* scroll to top button */}
            <SafeAreaView style={{
                position: 'absolute',
                justifyContent: 'flex-end',
                padding: 8,
                alignSelf: 'center',
                pointerEvents: (!focusedDate || focusedDate === today) ? 'none' : 'auto',
            }} edges={['top']}>
                <Animated.View style={{
                    flex: 1,
                    borderRadius: 1000,
                    padding: 4,
                    backgroundColor: theme.accent,
                    opacity: todayButtonOpacity,
                    transform: [{ translateY: todayButtonTransformY }]
                }}>
                    <Pressable onPress={() => { scrollToItem(0) }}>
                        <AntDesign name="arrowup" size={30} color={theme.text} />
                    </Pressable>
                </Animated.View>
            </SafeAreaView>
        </Animated.View>
    );
}
