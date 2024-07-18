import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { Button, DateCard, DateCardRef, Plane, Text, ThemeContext } from '~/2d';

import { Styles } from '@/styles';
import { getTodayDate } from '@/utils/date';
import { useFirebase } from '@/utils/FirebaseProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


function ListHeaderComponent({ focused, height }: { focused: boolean, height: number }) {
    const firebase = useFirebase();
    const navigation = useNavigation<any>();

    async function checkUncompletedChallengeToday() {
        const uncompletedChallengeToday = await firebase.checkUncompletedChallengeToday();
        console.log('uncompletedChallengeToday', uncompletedChallengeToday);
        if (uncompletedChallengeToday) {
            navigation.navigate('content');
        }
    }

    async function addFriend(username: string) {
        const { success } = await firebase.addFriend(username);
    }

    async function requestCompleteToday() {
        const { dataChanged } = await firebase.requestCompleteToday();
        if (dataChanged) {
            await triggerStreakScreen();
            await firebase.getUserData();
            // TODO: refresh leaderboard data
        }
    }

    async function triggerStreakScreen() {
        navigation.navigate('streak');
    }

    // TODO: better log out button
    async function logOut() {
        await firebase.logOut();
        navigation.navigate('start');
    }

    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View>
                <Button title="Log Out" onPress={logOut} filled={false} />
                {/* <Button title="today" onPress={requestCompleteToday} filled={false} /> */}
            </View>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40 }}>{firebase.userData?.username}</Text>
                <Text style={{ fontSize: 100 }}>{firebase.userData?.points}</Text>
            </View>
            <View style={{ ...Styles.centeringContainer }}>
                <Plane onPress={() => { }} />
            </View>
        </View>
    );
}

interface DateCardAttributes {
    date: string;
    ref: DateCardRef | null;
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    outerBackgroundColor: string;
}

export default function ContentScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);
    const today = getTodayDate();

    const [focusedDate, setFocusedDate] = useState<string | null>(getTodayDate());
    const [dates, setDates] = useState<DateCardAttributes[]>([
        {
            date: today,
            ref: null,
            textColor: '#5b16ff',
            borderColor: '#9669ff',
            backgroundColor: '#cdb7fe',
            outerBackgroundColor: '#d9c7ff'
        }
    ]);

    const backgroundColor = useSharedValue(theme.background);

    // Change background color when theme changes
    useEffect(() => {
        backgroundColor.value = withTiming(theme.background, { duration: 200 });
    }, [theme]);

    const flatListRef = useRef<FlatList<DateCardAttributes>>(null);

    const paddingAboveHeader = 50;
    const headerHeight = Dimensions.get("window").height * 0.8;

    const padding = 30;
    const boxWidth = Dimensions.get("window").width - padding * 2;
    const boxHeight = boxWidth * 1.6;

    /**
     * Add previous day to the list, adding a new card below the last one
     */
    function addPreviousDay() {
        const newDate = new Date(dates[dates.length - 1].date);
        newDate.setDate(newDate.getDate() - 1);
        if (newDate.getDate() % 2 === 1) {
            setDates([...dates, {
                date: newDate.toISOString().split('T')[0],
                ref: null,
                textColor: '#ef6024',
                borderColor: '#fa7e45',
                backgroundColor: '#fee099',
                outerBackgroundColor: '#fde4ac'
            }]);
        } else {
            setDates([...dates, {
                date: newDate.toISOString().split('T')[0],
                ref: null,
                textColor: '#5b16ff',
                borderColor: '#9669ff',
                backgroundColor: '#cdb7fe',
                outerBackgroundColor: '#d9c7ff'
            }]);
        }
    }

    /**
     * Update background and attributes when focused item changes
     * Called when item comes into view
     */
    function focusItem(item: DateCardAttributes | null) {
        if (item === null) {
            setFocusedDate(item);
            backgroundColor.value = withTiming(theme.background, { duration: 200 });
        } else {
            setFocusedDate(item.date);
            backgroundColor.value = withTiming(item.outerBackgroundColor, { duration: 200 });
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
            backgroundColor,
            paddingHorizontal: padding,
        }}>
            <FlatList
                ref={flatListRef}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPress={() => {
                            item.ref?.onPressIn();
                            scrollToItem(index);
                        }} onPressOut={item.ref?.onPressOut}>
                            <DateCard
                                ref={(ref: DateCardRef) => { item.ref = ref }}
                                focused={focusedDate === item.date}
                                completed={false}  // TODO: completed
                                date={item.date}
                                textColor={item.textColor}
                                borderColor={item.borderColor}
                                backgroundColor={item.backgroundColor}
                                style={{
                                    height: boxHeight
                                }}
                            />
                        </Pressable>
                    )
                }}
                data={dates}
                ListHeaderComponent={<ListHeaderComponent focused={focusedDate === 'header'} height={headerHeight} />}
                getItemLayout={(_, index) => {
                    return {
                        length: boxHeight + padding,
                        offset: (boxHeight + padding) * index + (paddingAboveHeader + headerHeight + padding),
                        index
                    }
                }}
                initialScrollIndex={0}
                keyExtractor={(item) => item.date}
                numColumns={1}
                onViewableItemsChanged={({ viewableItems }) => {
                    if (viewableItems.length === 0) {
                        // focus header
                        focusItem(null);
                    } else {
                        focusItem(viewableItems[0].item);
                    }
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 70,  // how much of the item is visible
                    waitForInteraction: false
                }}
                contentContainerStyle={{ gap: padding, paddingTop: paddingAboveHeader }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToOffsets={dates.map((_, i) =>
                    (boxHeight + padding) * i
                    + paddingAboveHeader + headerHeight + padding
                    - Dimensions.get("window").height * 0.5 + boxHeight / 2
                )}
                onEndReached={addPreviousDay}
                onEndReachedThreshold={0.9} // how far the user is down the current visible items
            />

            {focusedDate !== today && focusedDate !== null && (
                // scroll to top button
                <SafeAreaView style={{
                    position: 'absolute',
                    justifyContent: 'flex-end',
                    padding: 8,
                }} edges={['top']}>
                    <Button
                        title="Today"
                        filled={false}
                        onPress={() => { scrollToItem(0) }}
                    />
                </SafeAreaView>
            )}
        </Animated.View>
    );
}
