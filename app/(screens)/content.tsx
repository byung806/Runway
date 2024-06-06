import ContentCard from "@/components/screens/ContentCard";
import { getTodayDate } from "@/utils/date";
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Animated, View } from "react-native";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ContentScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any }) {
    const { colors } = useTheme();

    const [selected, setSelected] = useState('');

    console.log(new Date().toISOString());

    function handleDayPress(date: string) {
        console.log('selected day', date);
        setSelected(date);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <CalendarProvider
                date={getTodayDate()}
                onDateChanged={handleDayPress}
            >
                <Animated.View style={{ flex: 1 }}>
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
                            selectedDayTextColor: colors.text,
                            todayTextColor: colors.primary,
                            dayTextColor: colors.text,
                            dotColor: colors.primary,
                            indicatorColor: colors.primary,
                        }}
                    />
                    <View
                        style={{
                            flex: 1, backgroundColor: colors.primary,
                        }}
                    >
                        <ContentCard date={selected} />
                    </View>
                </Animated.View>
            </CalendarProvider>
        </SafeAreaView>
    );
}
