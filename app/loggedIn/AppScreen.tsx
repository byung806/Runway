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

    const [cards, setCards] = useState<DateCardAttributes[]>([]);

    const [currentlyAddingCard, setCurrentlyAddingCard] = useState(false);
    const [allContentLoaded, setAllContentLoaded] = useState(false);

    /**
     * Add previous day to the list, adding a new card below the last one
     */
    async function addPreviousDay() {
        if (currentlyAddingCard || allContentLoaded) return;

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
                {...(cards.length !== 0 && {headerArrowDown: true})}
                floatingArrowUp
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
