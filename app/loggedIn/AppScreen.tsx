import { BaseCardAttributes, DateCard, ListFooterComponent, ListHeaderComponent, ScrollableCards, ThemeContext } from '@/components/2d';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';

import { stringToDate } from '@/utils/date';
import { Content, useFirebase } from '@/utils/FirebaseProvider';
import { StackNavigationProp } from '@react-navigation/stack';


interface DateCardAttributes extends BaseCardAttributes {
    date: string;
    content: Content;
}

export default function AppScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [cards, setCards] = useState<DateCardAttributes[]>([]);

    const currentlyAddingCard = useRef(false);
    const canLoadMoreDays = useRef(true);
    // const [allContentLoaded, setAllContentLoaded] = useState(false);

    useEffect(() => {
        console.log('AppScreen useEffect');
        if (firebase.todayCompleted) {
            canLoadMoreDays.current = true;
            addPreviousDay();
        }
    }, [firebase.todayCompleted]);

    /**
     * Add previous day to the list, adding a new card below the last one
     */
    async function addPreviousDay() {
        if (currentlyAddingCard.current || !canLoadMoreDays.current) return;

        let newDate;
        if (cards.length === 0) {
            newDate = stringToDate(firebase.today);
        } else {
            newDate = stringToDate(cards[cards.length - 1].date);
            newDate.setDate(newDate.getDate() - 1);
        }

        const dateString = newDate.toISOString().split('T')[0];

        if (dateString === firebase.today && !firebase.todayCompleted) {
            canLoadMoreDays.current = false;
        }

        currentlyAddingCard.current = true;
        const data = await firebase.getContent(dateString);
        currentlyAddingCard.current = false;
        if (!data) {
            canLoadMoreDays.current = false;
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
        firstBoxHeight: (Dimensions.get("window").width - 30 * 2) * 1.6,
        boxHeight: (Dimensions.get("window").width - 30 * 2) * 1.2,
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
                {...(cards.length !== 0 && { headerArrowDown: true })}
                // floatingArrowUp
                renderItem={({ item }) =>
                    <DateCard
                        date={item.date}
                        content={item.content}

                        // for attributes that are injected by the ScrollableCards component (parent)
                        focused={undefined as never} colors={undefined as never} style={undefined as never}
                    />
                }
                footer={cards.length !== 0 ? undefined : <ListFooterComponent height={undefined as never} />}
                {...heights}
                initialBackgroundColor={theme.runwayBackgroundColor}
                onEndReached={addPreviousDay}
            />
        </>
    );
}
