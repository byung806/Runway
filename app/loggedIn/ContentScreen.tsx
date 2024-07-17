import React, { useContext, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { DateCard, ThemeContext } from '~/2d';

import { getTodayDate } from '@/utils/date';
import { StackNavigationProp } from '@react-navigation/stack';

export default function ContentScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);

    const [dates, setDates] = useState([
        {
            date: getTodayDate(),
            color: theme.accent
        }
    ]);

    function addPreviousDay() {
        const newDate = new Date(dates[dates.length - 1].date);
        newDate.setDate(newDate.getDate() - 1);
        console.log('newDate', newDate.toISOString().split('T')[0]);
        setDates([...dates, {
            date: newDate.toISOString().split('T')[0],
            color: theme.grayDark
        }]);
    }


    const padding = 30;
    const boxWidth = Dimensions.get("window").width - padding * 2;
    const boxHeight = boxWidth * 1.5;

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: padding,
        }}>
            <FlatList
                style={{ flex: 1 }}

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
                renderItem={({ item }) => {
                    return (
                        <DateCard
                            date={item.date}
                            height={boxHeight}
                        />
                    )
                }}
                snapToInterval={boxHeight + padding}
                onEndReached={addPreviousDay}
                onEndReachedThreshold={0.9} // how far the user is down the current visible items
            />
        </View>
    );
}
