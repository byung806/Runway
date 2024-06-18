import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentCard } from '~/2d';

import { getTodayDate } from '@/utils/date';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function ContentScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const { colors } = useTheme();

    const [selected, setSelected] = useState(useMemo(getTodayDate, []));

    function handleDayPress(date: string) {
        console.log('selected day', date);
        setSelected(date);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <CalendarProvider
                date={useMemo(getTodayDate, [])}
                onDateChanged={handleDayPress}

                style={{
                    flex: 0,
                }}
            >
                <WeekCalendar
                    disableAllTouchEventsForDisabledDays
                    animateScroll={false}
                    allowSelectionOutOfRange={true}
                    allowShadow={false}

                    pastScrollRange={1}
                    futureScrollRange={1}

                    theme={{
                        backgroundColor: colors.background,
                        calendarBackground: colors.background,
                        selectedDayBackgroundColor: colors.primary,
                        selectedDayTextColor: colors.card,
                        todayTextColor: colors.primary,
                        dayTextColor: colors.text,
                        dotColor: colors.primary,
                        indicatorColor: colors.primary,

                        textDayFontFamily: 'Silkscreen_400Regular',
                        textMonthFontFamily: 'Silkscreen_400Regular',
                        textDayHeaderFontFamily: 'Silkscreen_400Regular',
                    }}
                />
            </CalendarProvider>
            <View
                style={{
                    flex: 1,
                    // backgroundColor: colors.primary,
                }}
            >
                <ContentCard date={selected} />
            </View>
        </SafeAreaView>
    );
}
