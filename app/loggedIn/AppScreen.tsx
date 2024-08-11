import { BaseCardAttributes, DateCard, FloatingProfile, LeaderboardButton, ListFooterComponent, ListHeaderComponent, ScrollableCards, Text } from '@/components/2d';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';

import BorderedCard from '@/components/2d/BorderedCard';
import { Content, ThemeContext, useFirebase } from '@/providers';
import { stringToDate } from '@/utils/date';
import { StackNavigationProp } from '@react-navigation/stack';
// @ts-ignore
import CountDown from 'react-native-countdown-component';
import { secondsUntilTomorrowUTC } from '@/utils/date';


interface DateCardAttributes extends BaseCardAttributes {
    date: string;
    content: Content;
}

export default function AppScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [floatingProfileVisible, setFloatingProfileVisible] = useState(true);  // TODO:implement

    const [cards, setCards] = useState<DateCardAttributes[]>([
        {
            date: firebase.today,
            ref: null,
            colors: {
                // textColor: '#ffffff',
                // backgroundColor: '#000000',
                // borderColor: '#ffffff',
                // outerBackgroundColor: '#000000'
                textColor: theme.runwayTextColor,
                backgroundColor: theme.runwayBackgroundColor,
                borderColor: theme.runwayBorderColor,
                outerBackgroundColor: theme.runwayOuterBackgroundColor
            },
            // @ts-ignore
            content: null,
            index: 0
        }
    ]);

    useEffect(() => {
        addPreviousDay();
    }, []);

    const currentlyAddingCard = useRef(false);
    const canLoadMoreDays = useRef(true);
    // const [allContentLoaded, setAllContentLoaded] = useState(false);

    useEffect(() => {
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
        if (cards.length === 1) {
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

    const boxHeight = (Dimensions.get("window").width - 30 * 2) * 1.4;
    const padding = 30;
    const heights = {
        paddingAboveHeader: (Dimensions.get("window").height - boxHeight) / 2 - padding / 2,
        headerHeight: 0,
        // headerHeight: (Dimensions.get("window").height - ((Dimensions.get("window").width - 30 * 2) * 1.6)) / 2 - 30 / 2
        padding: padding,
        boxHeight: boxHeight,
        footerHeight: Dimensions.get("window").height * 0.4,
    };

    // all attributes with undefined as never are injected by the ScrollableCards component (parent) later - undefined as never is to prevent typescript errors
    return (
        <>
            <FloatingProfile visible={floatingProfileVisible} />
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
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        // coming soon
                        return (
                            <BorderedCard colors={item.colors}>
                                <View style={{ gap: 20 }}>
                                    <Text style={{ color: item.colors.textColor, fontSize: 20, textAlign: 'center' }}>Next card available in:</Text>
                                    <CountDown
                                        until={secondsUntilTomorrowUTC()}
                                        size={30}
                                        onFinish={() => { }}  // TODO
                                        digitStyle={{ backgroundColor: item.colors.textColor, borderRadius: 10, fontFamily: 'Inter_800ExtraBold' }}
                                        digitTxtStyle={{ color: item.colors.backgroundColor }}
                                        timeToShow={['H', 'M', 'S']}
                                        timeLabelStyle={{ opacity: 0 }}
                                    />
                                </View>
                            </BorderedCard>
                        );
                    } else {
                        return (
                            <DateCard
                                date={item.date}
                                content={item.content}

                                // for attributes that are injected by the ScrollableCards component (parent)
                                focused={undefined as never} colors={undefined as never} style={undefined as never}
                            />
                        );
                    }
                }}
                footer={
                    cards.length === 1 ? undefined :
                        <ListFooterComponent
                            height={undefined as never}
                            arrowUp={undefined as never}

                            showError={cards.length === 0}
                        />
                }
                {...heights}
                initialBackgroundColor={theme.runwayBackgroundColor}
                initialIndex={firebase.todayCompleted ? undefined : 1}
                onEndReached={addPreviousDay}
            />
            <LeaderboardButton onPress={() => navigation.navigate('leaderboard')} />
        </>
    );
}
