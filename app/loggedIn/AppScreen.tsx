import { BaseCardAttributes, DateCard, ListFooterComponent, ListHeaderComponent, ScrollableCards, ThemeContext } from '@/components/2d';
import React, { useContext, useState } from 'react';
import { Dimensions } from 'react-native';

import { getTodayDate, stringToDate } from '@/utils/date';
import { Content, useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';


interface DateCardAttributes extends BaseCardAttributes {
    date: string;
    content: Content;
}

export default function AppScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const today = getTodayDate();

    async function triggerStreakScreen() {
        navigation.navigate('streak');
    }

    async function requestCompleteDate(date?: string) {
        if (!date) date = today;
        // if a card for a date is already completed, don't make request
        if (firebase.userData?.point_days && date in firebase.userData.point_days) {
            return;
        }
        // TODO: to make request complete faster for backfilled days - instead of waiting for the response, just update the points locally
        // by checking if completed date is in point_days and close modal and update points immediately. then wait for this response and update user data if needed
        const { success } = await firebase.requestCompleteDate(date);
        console.log('dataChanged', success);
        if (success) {
            if (date === today) {
                triggerStreakScreen();
            }
            await firebase.getUserData();
            await firebase.getLeaderboard('global');
            // TODO: update friends leaderboard too if rank is ever implemented
        }
    }

    const [cards, setCards] = useState<DateCardAttributes[]>([]);

    const [currentlyAddingCard, setCurrentlyAddingCard] = useState(false);
    const [allContentLoaded, setAllContentLoaded] = useState(false);

    /**
     * Add previous day to the list, adding a new card below the last one
     */
    async function addPreviousDay() {
        if (currentlyAddingCard || allContentLoaded) return;

        console.log('addPreviousDay');

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
            colors: data.colors,
            index: cards.length
        }]);
    }

    const heights = {
        paddingAboveHeader: 50,
        headerHeight: Dimensions.get("window").height * 0.8,
        padding: 30,
        boxHeight: (Dimensions.get("window").width - 30 * 2) * 1.6,
        footerHeight: Dimensions.get("window").height * 0.8,
    };

    // all attributes with undefined as never are injected by the ScrollableCards component (parent) later - undefined as never is to prevent typescript errors
    return (
        <>
            <ScrollableCards<DateCardAttributes>
                data={cards}
                header={
                    <ListHeaderComponent
                        height={heights.headerHeight}

                        arrowDown={undefined as never}
                    />
                }
                headerArrowDown
                floatingArrowUp
                renderItem={({ item }) =>
                    <DateCard
                        cardCompleted={item.date in (firebase.userData?.point_days ?? {})}
                        date={item.date}
                        content={item.content}
                        requestCompleteDate={requestCompleteDate}

                        // for attributes that are injected by the ScrollableCards component (parent)
                        focused={undefined as never} colors={undefined as never} style={undefined as never}
                    />
                }
                footer={<ListFooterComponent height={undefined as never} />}
                {...heights}
                initialBackgroundColor={theme.runwayBackgroundColor}
                onEndReached={addPreviousDay}
            />
        </>
    );
}
