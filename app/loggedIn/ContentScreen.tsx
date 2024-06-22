import React, { useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentCard, ThemeContext } from '~/2d';

import { getTodayDate } from '@/utils/date';
import { StackNavigationProp } from '@react-navigation/stack';

export default function ContentScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);

    const [selected, setSelected] = useState(useMemo(getTodayDate, []));

    function handleDayPress(date: string) {
        console.log('selected day', date);
        setSelected(date);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
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
                        backgroundColor: theme.background,
                        calendarBackground: theme.background,
                        selectedDayBackgroundColor: theme.accent,
                        selectedDayTextColor: theme.textInverse,
                        todayTextColor: theme.accent,
                        dayTextColor: theme.text,
                        dotColor: theme.accent,
                        indicatorColor: theme.accent,

                        textDayFontFamily: 'Silkscreen_400Regular',
                        textMonthFontFamily: 'Silkscreen_400Regular',
                        textDayHeaderFontFamily: 'Silkscreen_400Regular',
                    }}
                />
            </CalendarProvider>
            <View
                style={{
                    flex: 1,
                    // backgroundColor: colors.accent,
                }}
            >
                <ContentCard date={selected} />
            </View>
        </SafeAreaView>
    );
}
