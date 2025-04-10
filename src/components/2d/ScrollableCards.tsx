import React, { cloneElement, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable } from 'react-native';

import { ContentColors, ThemeContext } from '@/providers';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { ScrollArrow } from './Arrow';

import * as Haptics from 'expo-haptics';
import { delay } from '@/utils/utils';
import { Styles } from '@/styles';

interface ScrollableCardsProps<T> {
    data: T[],
    scrollable?: boolean,
    renderHeader?: ({ focused, height }: { focused: boolean, height: number }) => JSX.Element,
    // floatingArrowUp?: boolean,
    renderItem: ({ item, focused, style }: { item: T, focused: boolean, style: any }) => JSX.Element,
    renderFooter?: ({ height, arrowUp }: { height: number, arrowUp: JSX.Element }) => JSX.Element,
    paddingAboveHeader: number,
    headerHeight: number,
    padding: number,
    boxHeight: number,
    footerHeight: number,
    initialBackgroundColor: string,
    initialIndex?: number,
    onScrollBeginDrag?: () => void | Promise<void>,
    onScrollEndDrag?: () => void | Promise<void>,
    onMomentumScrollBegin?: () => void | Promise<void>,
    onMomentumScrollEnd?: () => void | Promise<void>,
    onEndReached?: () => void | Promise<void>
}

export interface ScrollableCardsRef<T> {
    scrollToOffset: (offset: number) => void;
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
    const { data, scrollable = true, renderHeader, renderItem, renderFooter, paddingAboveHeader, headerHeight, padding, boxHeight, footerHeight, initialBackgroundColor, initialIndex, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollBegin, onMomentumScrollEnd, onEndReached } = props;

    useImperativeHandle(ref, () => ({
        scrollToOffset,
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

    // Scroll to initial index (has to be done after flatlist is initialized)
    const initialScrollFulfilled = useRef(false);
    useEffect(() => {
        async function scrollToInitialIndex() {
            if (!initialScrollFulfilled.current && initialIndex && data.length > initialIndex) {
                await delay(500);  // wait for flatlist to initialize
                scrollToIndex(initialIndex);
                initialScrollFulfilled.current = true;
            }
        }
        scrollToInitialIndex();
    }, [data]);

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

    async function scrollToOffset(offset: number) {
        flatListRef.current?.scrollToOffset({ offset, animated: true });
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
            // width: '100%',
            backgroundColor: outerBackgroundColor
        }}>
            <FlatList
                ref={flatListRef}
                scrollEnabled={scrollable}
                renderItem={({ item }) => {
                    // item.ref = useRef<BaseCardRef>(null);
                    // TODO context: can convert focused, colors, style, index to context and read context inside card
                    return (
                        <Pressable
                            android_disableSound={true}
                            onPressIn={item.ref?.onPressIn}
                            onPress={() => {
                                if (focusedIndex !== item.index) scrollToIndex(item.index);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            onPressOut={item.ref?.onPressOut}
                            style={{
                                marginHorizontal: padding,
                            }}
                        >
                            {
                                renderItem({
                                    item,
                                    focused: focusedIndex === item.index,
                                    style: { height: boxHeight }
                                })
                            }
                        </Pressable>
                    )
                }}
                data={data}
                ListHeaderComponent={renderHeader && renderHeader({ focused: focusedIndex === null, height: headerHeight })}
                ListFooterComponent={renderFooter && renderFooter({
                    height: footerHeight, arrowUp: (
                        <ScrollArrow
                            type='up'
                            visible={true}
                            onPress={() => { scrollToOffset(0); }}
                        />
                    )
                })}

                //     header && cloneElement(header, {
                //     height: headerHeight,
                //     arrowDown: headerArrowDown ? (
                //         <ScrollArrow
                //             type='down'
                //             visible={focusedIndex === null}
                //             onPress={() => { scrollToIndex(0); }}
                //         />
                //     ) : undefined
                // })}
                // ListFooterComponent={footer && cloneElement(footer, {
                //     height: footerHeight,
                //     arrowUp: (
                //         <ScrollArrow
                //             type='up'
                //             visible={true}
                //             onPress={() => { scrollToOffset(0); }}
                //         />
                //     )
                // })}
                getItemLayout={(_, index) => {
                    return {
                        length: boxHeight + padding,
                        offset: (boxHeight + padding) * index + (paddingAboveHeader + (renderHeader ? (headerHeight + padding / 6) : (- padding / 2))),
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
                contentContainerStyle={{ gap: padding, paddingTop: paddingAboveHeader, paddingBottom: renderFooter ? 0 : (Dimensions.get("window").height - boxHeight) / 2 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate='fast'
                snapToAlignment='start'
                snapToOffsets={data.map((_, i) =>
                    (boxHeight + padding) * i
                    + paddingAboveHeader + (renderHeader ? (headerHeight + padding) : 0)
                    - Dimensions.get("window").height * 0.5 + boxHeight / 2
                )}
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onEndReached={onEndReached}
                onEndReachedThreshold={2}
            />

            {/* {floatingArrowUp ? (
                <ScrollArrow
                    type='upFloating'
                    visible={focusedIndex !== null && focusedIndex !== 0 && focusedIndex !== 1}
                    onPress={() => { scrollToIndex(0); }}
                />
            ) : null} */}
        </Animated.View>
    );
};

export default forwardRef(ScrollableCards) as <T extends BaseCardAttributes>(props: ScrollableCardsProps<T> & { ref?: React.Ref<ScrollableCardsRef<T>> }) => JSX.Element;
