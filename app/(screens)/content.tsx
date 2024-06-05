import ContentCard from "@/components/screens/ContentCard";
import { getTodayDate } from "@/utils/date";
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Animated, View } from "react-native";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";


export default function ContentScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any }) {
    const { colors } = useTheme();

    const [selected, setSelected] = useState('');

    console.log(new Date().toISOString());

    function handleDayPress(date: string) {
        console.log('selected day', date);
        setSelected(date);
    }

    return (
        <>
            <CalendarProvider
                date={getTodayDate()}
                onDateChanged={handleDayPress}
            >
                <Animated.View style={{ flex: 1 }}>
                    <WeekCalendar
                        disableAllTouchEventsForDisabledDays
                        animateScroll={false}
                        allowSelectionOutOfRange={true}
                        allowShadow={true}

                        pastScrollRange={1}
                        futureScrollRange={1}

                        theme={{
                            backgroundColor: colors.background,
                            calendarBackground: colors.background,
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
        </>
    );
}
