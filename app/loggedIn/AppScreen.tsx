import { BaseCardAttributes, DateCard, FloatingNavbar, FloatingProfile, ListFooterComponent, ScrollableCards, ScrollableCardsRef, Text } from '@/components/2d';
import BorderedCard from '@/components/2d/BorderedCard';
import Button, { IconButton } from '@/components/2d/Button';
import ProfileModal from '@/components/2d/ProfileModal';
import { FirebaseContent, ThemeContext, useFirebase } from '@/providers';
import { Styles } from '@/styles';
import { secondsUntilTomorrowUTC, stringToDate } from '@/utils/date';
import { delay } from '@/utils/utils';
import Foundation from '@expo/vector-icons/Foundation';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, LayoutAnimation, Linking, Pressable, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
// @ts-ignore
import CountDown from 'react-native-countdown-component';
import Rate from 'react-native-rate';



interface DateCardAttributes extends BaseCardAttributes {
    date: string;
    content: FirebaseContent;
}

export default function AppScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [floatingProfileVisible, setFloatingProfileVisible] = useState(true);

    const initialCardState = [
        {
            date: firebase.today,
            ref: null,
            colors: theme.scheme === 'dark' ? {
                textColor: '#ffffff',
                backgroundColor: '#000000',
                borderColor: '#ffffff',
                outerBackgroundColor: '#000000'
            } : {
                textColor: '#000000',
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                outerBackgroundColor: '#ffffff'
            },
            content: null,
            index: 0
        }
    ]

    const scrollableCardsRef = useRef<ScrollableCardsRef<DateCardAttributes>>(null);
    // @ts-expect-error
    const [cards, setCards] = useState<DateCardAttributes[]>(initialCardState);

    useEffect(() => {
        addPreviousDay();
    }, []);

    async function onNewDay() {
        await delay(300);  // make sure it's a new day
        firebase.updateDay();

        // @ts-expect-error
        setCards(initialCardState);

        currentlyAddingCard.current = false;
        canLoadMoreDays.current = true;

        await delay(200);
        scrollableCardsRef.current?.scrollToIndex(1);
    }

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

        // Load only today if today is not completed
        // if (dateString === firebase.today && !firebase.todayCompleted) {
        //     canLoadMoreDays.current = false;
        // }

        currentlyAddingCard.current = true;
        const data = await firebase.getContent(dateString);
        currentlyAddingCard.current = false;
        if (!data) {
            canLoadMoreDays.current = false;
            return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setCards([...cards, {
            date: dateString,
            ref: null,
            content: data.content,
            colors: data.colors,
            index: cards.length
        }]);
    }

    const padding = 30;
    const boxHeight = (Dimensions.get("window").width - padding * 2) * 1.4;
    const heights = {
        paddingAboveHeader: (Dimensions.get("window").height - boxHeight) / 2,
        headerHeight: (firebase.userData?.rated === true || (firebase.userData?.streak ?? 0) === 0) && !firebase.news ? 0 : 50,
        padding: padding,
        boxHeight: boxHeight,
        footerHeight: Dimensions.get("window").height * 0.4,
    };

    const [rateButtonDisabled, setRateButtonDisabled] = useState(false);

    return (
        <>
            <FloatingProfile visible={floatingProfileVisible} />
            <ScrollableCards<DateCardAttributes>
                ref={scrollableCardsRef}
                data={cards}
                renderHeader={() =>
                    <>
                        {firebase.userData?.rated !== true && (firebase.userData?.streak ?? 0) !== 0 && !firebase.news &&
                            <View style={{ height: heights.headerHeight, ...Styles.centeringContainer }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <AntDesign name="star" size={24} color={theme.trophyYellow} />
                                    <AntDesign name="star" size={24} color={theme.trophyYellow} />
                                    <AntDesign name="star" size={24} color={theme.trophyYellow} />
                                    <AntDesign name="star" size={24} color={theme.trophyYellow} />
                                    <AntDesign name="star" size={24} color={theme.trophyYellow} />
                                </View>
                                <Button title="Enjoying Runway? Rate us!" backgroundColor='transparent' textColor={theme.runwayTextColor} disabled={rateButtonDisabled} onPress={async () => {
                                    setRateButtonDisabled(true);
                                    const options = {
                                        AppleAppID: "6639588047",
                                        preferInApp: false,
                                        openAppStoreIfInAppFails: true,
                                        fallbackPlatformURL: "https://runwaymobile.app/",
                                    }
                                    Rate.rate(options, async (success, errorMessage) => {
                                        if (success) {
                                            // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                                            await firebase.setRated();
                                            await firebase.getUserData();
                                        }
                                        if (errorMessage) {
                                            // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
                                            console.error(`Rate.rate() error: ${errorMessage}`)
                                        }
                                        setRateButtonDisabled(false);
                                    })
                                }} />
                            </View>}

                        {firebase.news &&
                            <View style={{ height: heights.headerHeight, ...Styles.centeringContainer }}>
                                <Text style={{ color: theme.white, fontSize: 20, textAlign: 'center' }}>{firebase.news}</Text>
                            </View>}
                    </>
                }
                {...(cards.length !== 0 && { headerArrowDown: true })}
                // floatingArrowUp
                renderItem={({ item, focused, style }) => {
                    if (item.index === 0) {
                        // Coming soon card
                        return (
                            <BorderedCard colors={item.colors} style={style}>
                                <>
                                    <View style={{ gap: 20 }}>
                                        <Text style={{ color: item.colors.textColor, fontSize: 20, textAlign: 'center' }}>Next card available in:</Text>
                                        <CountDown
                                            until={secondsUntilTomorrowUTC()}
                                            size={30}
                                            onFinish={onNewDay}
                                            digitStyle={{ backgroundColor: item.colors.textColor, borderRadius: 10, fontFamily: 'FredokaOne_400Regular' }}
                                            digitTxtStyle={{ color: item.colors.backgroundColor }}
                                            timeToShow={['H', 'M', 'S']}
                                            timeLabelStyle={{ opacity: 0 }}
                                        />

                                    </View>
                                    <View style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        marginBottom: 20,
                                        width: '100%',
                                    }}>
                                        <Pressable onPress={() => {
                                            Linking.openURL('mailto:runwaystem@gmail.com?subject=Runway Possible Content Creator&body=I would like to create content for Runway!\n\nHere are some ideas I have:\n- ');
                                        }} style={{ gap: 8, ...Styles.centeringContainer, ...Styles.shadow, paddingHorizontal: 30 }}>
                                            <Foundation name="mail" size={24} color={item.colors.textColor} />
                                            <Text style={{ textAlign: 'center', fontSize: 14, color: item.colors.textColor }}>
                                                Want to create content for Runway?
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            </BorderedCard>
                        );
                    } else {
                        return (
                            <DateCard
                                date={item.date}
                                content={item.content}
                                colors={item.colors}
                                focused={focused}
                                style={style}
                            />
                        );
                    }
                }}
                renderFooter={({ height, arrowUp }) => {
                    return (
                        <ListFooterComponent
                            height={height}
                            arrowUp={arrowUp}
                            showError={cards.length === 0}
                        />
                    )
                }}
                {...heights}
                initialBackgroundColor={theme.runwayBackgroundColor}
                initialIndex={firebase.todayCompleted ? undefined : 1}
                onScrollBeginDrag={() => setFloatingProfileVisible(false)}
                onMomentumScrollBegin={() => setFloatingProfileVisible(false)}
                onMomentumScrollEnd={() => setFloatingProfileVisible(true)}
                onEndReached={addPreviousDay}
            />

            <IconButton type='settings' visible={floatingProfileVisible} onPress={() => setProfileModalVisible(true)} />
            <ProfileModal visible={profileModalVisible} setVisible={setProfileModalVisible} />

            <IconButton type='leaderboard' visible={floatingProfileVisible} onPress={() => navigation.navigate('leaderboard')} />
        </>
    );
}
