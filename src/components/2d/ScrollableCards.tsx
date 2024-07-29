import React, { cloneElement, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable } from 'react-native';

import { ContentColors } from '@/utils/FirebaseProvider';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemeContext } from './ThemeProvider';
import ScrollArrow from './ScrollArrow';

interface ScrollableCardsProps<T> {
    data: T[],
    scrollable?: boolean,
    header: JSX.Element,
    headerArrowDown?: boolean,
    floatingArrowUp?: boolean,
    renderItem: ({ item }: { item: T }) => JSX.Element,
    footer: JSX.Element,
    paddingAboveHeader: number,
    headerHeight: number,
    padding: number,
    boxHeight: number,
    footerHeight: number,
    initialBackgroundColor: string,
    onEndReached?: () => void | Promise<void>
}

export interface ScrollableCardsRef<T> {
    scrollToIndex: (index: number) => void;
}

export interface BaseCardAttributes {
    ref: BaseCardRef | null;
    colors: ContentColors;
    index: number;
}

interface BaseCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

/**
 * Scrollable cards component - a flatlist with cards that can be scrolled through
 * Manages the focused card and background color
 */
const ScrollableCards = <T extends BaseCardAttributes>(props: ScrollableCardsProps<T>, ref: React.Ref<ScrollableCardsRef<T>> | undefined) => {
    const { data, scrollable = true, header, headerArrowDown, floatingArrowUp, renderItem, footer, paddingAboveHeader, headerHeight, padding, boxHeight, footerHeight, initialBackgroundColor, onEndReached } = props;

    useImperativeHandle(ref, () => ({
        scrollToIndex
    }));

    const theme = useContext(ThemeContext);

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [focusedCard, setFocusedCard] = useState<T | null>(null);

    const outerBackgroundColor = useSharedValue(initialBackgroundColor);

    // Change background color when theme changes
    useEffect(() => {
        outerBackgroundColor.value = withTiming(initialBackgroundColor, { duration: 200 });
    }, [theme]);

    const flatListRef = useRef<FlatList<T>>(null);

    /**
     * Update background and attributes when focused item changes
     * Called when item comes into view
     */
    function focusItem(item: T | null) {
        if (item === null) {
            setFocusedIndex(item);
            setFocusedCard(null);
            outerBackgroundColor.value = withTiming(initialBackgroundColor, { duration: 200 });
        } else {
            setFocusedIndex(item.index);
            setFocusedCard(item);
            outerBackgroundColor.value = withTiming(item.colors.outerBackgroundColor, { duration: 200 });
        }
    }

    /**
     * Scroll to card with index
     */
    async function scrollToIndex(index: number) {
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
                scrollEnabled={scrollable}
                renderItem={({ item }) => {
                    // TODO context: can convert focused, colors, style, index to context and read context inside card
                    return (
                        <Pressable onPressIn={() => {
                            item.ref?.onPressIn();
                            if (focusedIndex !== item.index) scrollToIndex(item.index);
                        }} onPressOut={item.ref?.onPressOut}>
                            {
                                cloneElement(renderItem({ item }), {
                                    ref: (ref: BaseCardRef) => { item.ref = ref },
                                    focused: focusedIndex === item.index,
                                    colors: item.colors,
                                    style: {
                                        height: boxHeight
                                    },
                                    index: item.index
                                })
                            }
                        </Pressable>
                    )
                }}
                data={data}
                ListHeaderComponent={cloneElement(header, {
                    height: headerHeight,
                    arrowDown: headerArrowDown ? (
                        <ScrollArrow
                            type='down'
                            visible={focusedIndex === null}
                            onPress={() => { scrollToIndex(0); }}
                        />
                    ) : undefined
                })}
                ListFooterComponent={cloneElement(footer, { height: footerHeight })}
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
                snapToOffsets={data.map((_, i) =>
                    (boxHeight + padding) * i
                    + paddingAboveHeader + headerHeight + padding
                    - Dimensions.get("window").height * 0.5 + boxHeight / 2
                )}
                onEndReached={onEndReached}
                onEndReachedThreshold={2}
            />

            {floatingArrowUp ? (
                <ScrollArrow
                    type='upFloating'
                    visible={focusedIndex !== null && focusedIndex !== 0 && focusedIndex !== 1}
                    onPress={() => { scrollToIndex(0); }}
                />
            ) : null}
        </Animated.View>
    );
};

export default forwardRef(ScrollableCards) as <T extends BaseCardAttributes>(props: ScrollableCardsProps<T> & { ref?: React.Ref<ScrollableCardsRef<T>> }) => JSX.Element;
