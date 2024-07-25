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

    const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
    const [cards, setCards] = useState<OnboardingCardAttributes[]>([
        {ref: null, colors: {
            outerBackgroundColor: "#ffe063",
            borderColor: "#2cab1c",
            backgroundColor: "#f4d03e",
            textColor: "#aa8c16"
            }, index: 0}, {ref: null, colors: {
                outerBackgroundColor: "#ffe063",
                borderColor: "#2cab1c",
                backgroundColor: "#f4d03e",
                textColor: "#aa8c16"
                }, index: 1}, {ref: null, colors: {
                    outerBackgroundColor: "#ffe063",
                    borderColor: "#2cab1c",
                    backgroundColor: "#f4d03e",
                    textColor: "#aa8c16"
                    }, index: 2}
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

    const paddingAboveHeader = 50;
    const headerHeight = Dimensions.get("window").height * 0.8;

    const padding = 30;
    const boxWidth = Dimensions.get("window").width - padding * 2;
    const boxHeight = boxWidth * 1.6;

    const footerHeight = Dimensions.get("window").height * 0.8;
    
    function focusItem(item: OnboardingCardAttributes | null) {
        if (item === null || item.index === 0) {
            todayButtonOpacity.value = withTiming(0, { duration: 200 });
            todayButtonTransformY.value = withTiming(-50, { duration: 200 });
        } else {
            todayButtonOpacity.value = withTiming(1, { duration: 1000 });
            todayButtonTransformY.value = withTiming(0, { duration: 1000 });
        }

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
                            />
                        </Pressable>
                    )
                }}
                data={cards}
                ListHeaderComponent={<OnboardingHeaderComponent height={headerHeight} />}
                ListFooterComponent={<ListFooterComponent height={footerHeight} />}
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