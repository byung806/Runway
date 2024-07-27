import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { DateCard, DateCardRef, ListFooterComponent, ListHeaderComponent, Text, ThemeContext } from '@/components/2d';

import { Styles } from '@/styles';
import { getTodayDate, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StackNavigationProp } from '@react-navigation/stack';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingCard, { OnboardingCardRef } from '@/components/2d/OnboardingCard';
import OnboardingHeaderComponent from '@/components/2d/OnboardingHeaderComponent';
import OnboardingFooterComponent from '@/components/2d/OnboardingFooterComponent';


const ReactSpringAnimatedView = animated(View);

interface OnboardingCardAttributes {
    ref: OnboardingCardRef | null;
    colors: ContentColors;
    index: number;
}

export default function OnboardingScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const today = getTodayDate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
    const [cards, setCards] = useState<OnboardingCardAttributes[]>([
        {
            ref: null, colors: {
                outerBackgroundColor: "#8c62d0",
                borderColor: "#b3a4e0",
                backgroundColor: "#6d3b9f",
                textColor: "#ffffff"
            }, index: 0
        }, {
            ref: null, colors: {
                outerBackgroundColor: "#6b44b2",
                borderColor: "#3f1d8a",
                backgroundColor: "#a58aeb",
                textColor: "#ffffff"
            }, index: 1
        }, {
            ref: null, colors: {
                outerBackgroundColor: "#7453c7",
                borderColor: "#a58aeb",
                backgroundColor: "#3f1d8a",
                textColor: "#ffffff"
            }, index: 2
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#5a3494",
                borderColor: "#8e6cbf",
                backgroundColor: "#2e1463",
                textColor: "#ffffff"
            }, index: 3
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#4a2583",
                borderColor: "#6b4abf",
                backgroundColor: "#1e0d4d",
                textColor: "#ffffff"
            }, index: 4
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#4a2583",
                borderColor: "#6b4abf",
                backgroundColor: "#1e0d4d",
                textColor: "#ffffff"
            }, index: 5
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#4a2583",
                borderColor: "#6b4abf",
                backgroundColor: "#1e0d4d",
                textColor: "#ffffff"
            }, index: 6
        },
    ]);
    const todayButtonTransformY = useSharedValue(0);
    const todayButtonOpacity = useSharedValue(0);
    const outerBackgroundColor = useSharedValue(theme.background);
    const goButtonColor = useSharedValue('transparent');
    const goButtonOpacity = useSharedValue(0);

    // for GO button
    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.9,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.wobbly
    });

    // Change background color when theme changes
    useEffect(() => {
        outerBackgroundColor.value = withTiming(theme.background, { duration: 200 });
    }, [theme]);

    const flatListRef = useRef<FlatList<OnboardingCardAttributes>>(null);

    const paddingAboveHeader = 0;
    const headerHeight = Dimensions.get("window").height * 1;

    const padding = 30;
    const boxWidth = Dimensions.get("window").width - padding * 2;
    const boxHeight = boxWidth * 1.6;

    const footerHeight = Dimensions.get("window").height * 0.8;

    function focusItem(item: OnboardingCardAttributes | null) {

        if (item === null) {
            setFocusedIndex(item);
            outerBackgroundColor.value = withTiming(theme.background, { duration: 200 });
            goButtonColor.value = withTiming('transparent', { duration: 200 });
            goButtonOpacity.value = withTiming(0, { duration: 200 });
        } else {
            setFocusedIndex(item.index);
            outerBackgroundColor.value = withTiming(item.colors.outerBackgroundColor, { duration: 200 });
            goButtonColor.value = withTiming(item.colors.textColor, { duration: 200 });
            goButtonOpacity.value = withTiming(1, { duration: 200 });
        }
    }

    /**
     * Scroll to card with index
     */
    async function scrollToItem(index: number) {
        flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
    }

    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: outerBackgroundColor,
            paddingHorizontal: padding,
        }}>
            <FlatList
                ref={flatListRef}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPressIn={() => {
                            item.ref?.onPressIn();
                            scrollToItem(index);
                        }} onPressOut={item.ref?.onPressOut}>
                            <OnboardingCard
                                ref={(ref: OnboardingCardRef) => { item.ref = ref }}
                                focused={focusedIndex === item.index}
                                colors={item.colors}
                                style={{
                                    height: boxHeight
                                }}
                                username={username}
                                index={item.index}
                            />
                        </Pressable>
                    )
                }}
                data={cards}
                ListHeaderComponent={<OnboardingHeaderComponent height={headerHeight} setUsername={setUsername} />}
                ListFooterComponent={<OnboardingFooterComponent height={footerHeight} />}
                getItemLayout={(_, index) => {
                    return {
                        length: boxHeight + padding,
                        offset: (boxHeight + padding) * index + (paddingAboveHeader + headerHeight + padding),
                        index
                    }
                }}
                keyExtractor={(item) => item.index.toString()}
                numColumns={1}
                onViewableItemsChanged={({ viewableItems }) => {
                    if (viewableItems.length === 0) {
                        // focus header or footer or between items
                        focusItem(null);
                    } else {
                        focusItem(viewableItems[0].item);
                    }
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 75,  // how much of the item is visible
                    waitForInteraction: false
                }}
                contentContainerStyle={{ gap: padding, paddingTop: paddingAboveHeader }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate='fast'
                snapToOffsets={cards.map((_, i) =>
                    (boxHeight + padding) * i
                    + paddingAboveHeader + headerHeight + padding
                    - Dimensions.get("window").height * 0.5 + boxHeight / 2
                )}
            />

        </Animated.View>
    );
}