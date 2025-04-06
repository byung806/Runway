import React from 'react';
import { StyleSheet, FlatList, View, Text, Dimensions } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';


const items = [
    { id: 1, text: 'A' },
    { id: 2, text: 'B' },
    { id: 3, text: 'C' },
    { id: 4, text: 'D' },
    { id: 5, text: 'E' },
    { id: 6, text: 'F' },
    { id: 7, text: 'G' },
    { id: 8, text: 'H' },
    { id: 9, text: 'I' },
    { id: 10, text: 'J' },
    { id: 11, text: 'K' },
    { id: 12, text: 'L' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH / 3;
const data = [...items, ...items, ...items];

export const Home = () => {
    const transX = useSharedValue(0);

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        return <Item index={index} item={item} transX={transX} />;
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            transX.value = event.contentOffset.x;
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <Animated.FlatList
                    onScroll={scrollHandler}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                    data={data}
                    decelerationRate="fast"
                    centerContent
                    snapToInterval={ITEM_WIDTH}
                    scrollEventThrottle={16}
                    pagingEnabled
                    snapToAlignment="center"
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                />
            </View>
        </View>
    );
};

const Item = ({ index, item, transX }:
    { index: number, item: any, transX: any }
) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacityAnimation(transX, index),
            transform: [
                {
                    scale: scaleAnimation(transX, index),
                },
            ],
        };
    });
    return (
        <Animated.View style={[styles.box, animatedStyle]} item={item}>
            <Text style={styles.label}>{item.text}</Text>
        </Animated.View>
    );
};

const scaleAnimation = (transX: any, index: number) => {
    'worklet';

    return interpolate(
        transX.value,
        [
            // (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
            // (index + 2) * ITEM_WIDTH,
        ],
        // [0.5, 0.5, 1, 0.5, 0.5],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP,
    );
};

const opacityAnimation = (transX: any, index: number) => {
    'worklet';

    return interpolate(
        transX.value,
        [
            (index - 3) * ITEM_WIDTH,
            (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
            (index + 2) * ITEM_WIDTH,
            (index + 3) * ITEM_WIDTH,
        ],
        [0, 0.5, 0.8, 1, 0.8, 0.5, 0],
        Extrapolation.CLAMP,
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#efefef',
    },
    listContainer: {
        height: ITEM_WIDTH + 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        height: ITEM_WIDTH * 2,
        flexGrow: 0,
        paddingHorizontal: ITEM_WIDTH,
    },
    box: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        backgroundColor: 'blue',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#fff',
    },
});