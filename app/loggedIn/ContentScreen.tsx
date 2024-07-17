import React, { useContext, useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { Button, DateCard, ThemeContext } from '~/2d';

import { getTodayDate } from '@/utils/date';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DateType {
    date: string;
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    outerBackgroundColor: string;
}

export default function ContentScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);
    const today = getTodayDate();

    const [focusedDate, setFocusedDate] = useState(getTodayDate());
    const [dates, setDates] = useState<DateType[]>([
        {
            date: today,
            textColor: '#5b16ff',
            borderColor: '#9669ff',
            backgroundColor: '#cdb7fe',
            outerBackgroundColor: '#d9c7ff'
        }
    ]);

    function addPreviousDay() {
        const newDate = new Date(dates[dates.length - 1].date);
        newDate.setDate(newDate.getDate() - 1);
        if (newDate.getDate() % 2 === 1) {
            setDates([...dates, {
                date: newDate.toISOString().split('T')[0],
                textColor: '#ef6024',
                borderColor: '#fa7e45',
                backgroundColor: '#fee099',
                outerBackgroundColor: '#fde4ac'
            }]);
        } else {
            setDates([...dates, {
                date: newDate.toISOString().split('T')[0],
                textColor: '#5b16ff',
                borderColor: '#9669ff',
                backgroundColor: '#cdb7fe',
                outerBackgroundColor: '#d9c7ff'
            }]);
        }
    }

    const backgroundColor = useSharedValue(theme.background);

    function focusDate(item: DateType) {
        setFocusedDate(item.date);
        backgroundColor.value = withTiming(item.outerBackgroundColor, { duration: 200 });
    }


    const padding = 30;
    const boxWidth = Dimensions.get("window").width - padding * 2;
    const boxHeight = boxWidth * 1.6;
    const flatListRef = useRef<FlatList<DateType>>(null);

    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor,
            paddingHorizontal: padding,
        }}>
            <FlatList
                ref={flatListRef}
                style={{ flex: 1 }}
                onViewableItemsChanged={({ viewableItems, changed }) => {
                    // console.log(viewableItems.map((item: any) => item.item.date));
                    focusDate(viewableItems[0].item);
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 70,
                    waitForInteraction: false
                }}
                data={dates}
                contentContainerStyle={{ gap: padding, paddingTop: Dimensions.get("window").height * 0.5 - boxHeight / 2 }}
                numColumns={1}
                contentOffset={{ x: 0, y: -Dimensions.get("window").height * 0.5 }}
                keyExtractor={(item) => item.date}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                // onScrollBeginDrag={() => setAllowCardPress(false)}
                // onScrollEndDrag={() => setAllowCardPress(true)}
                decelerationRate="fast"
                getItemLayout={(data, index) => (
                    { length: boxHeight + padding, offset: (boxHeight + padding) * index, index }
                )}
                renderItem={({ item }) => {
                    return (
                        <DateCard
                            focused={focusedDate === item.date}
                            completed={false}  // TODO: completed
                            date={item.date}
                            textColor={item.textColor}
                            borderColor={item.borderColor}
                            backgroundColor={item.backgroundColor}
                            height={boxHeight}
                        />
                    )
                }}
                snapToInterval={boxHeight + padding}
                onEndReached={addPreviousDay}
                onEndReachedThreshold={0.9} // how far the user is down the current visible items
            />
            {focusedDate !== today && (
                // scroll to top button
                <SafeAreaView style={{
                    position: 'absolute',
                    justifyContent: 'flex-end',
                    padding: 8,
                }} edges={['top']}>
                    <Button
                        title="Today"
                        filled={false}
                        onPress={() => {
                            flatListRef.current?.scrollToIndex({ index: 0, viewPosition: 0.5 });
                        }}
                    />
                </SafeAreaView>
            )}
        </Animated.View>
    );
}
