import { Styles } from '@/styles';
import { dayIsYesterday, sameDay, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { forwardRef, memo, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import ContentModal from './ContentModal';
import { Button } from './Button';


interface DateCardProps {
    focused: boolean;
    completed: boolean;
    date: string;
    content: Content;
    colors: ContentColors;
    style: any;
}

export interface DateCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const ReactSpringAnimatedView = animated(View);

const DateCard = forwardRef(({ focused, completed, date, content, colors, style }: DateCardProps, ref) => {
    const theme = useContext(ThemeContext);

    const [contentModalVisible, setContentModalVisible] = useState(false);

    const { scale: cardScale, onPressIn: cardOnPressIn, onPressOut: cardOnPressOut } = useBounceAnimation({
        scaleTo: 0.94,
        config: config.gentle
    });

    const { scale: buttonScale, onPressIn: buttonOnPressIn, onPressOut: buttonOnPressOut } = useBounceAnimation({
        scaleTo: 0.9,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle
    });

    const initialTransformY = 80;

    const titleTransformY = useSharedValue(-initialTransformY);
    const goTransformY = useSharedValue(initialTransformY);
    const cardContentOpacity = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        onPressIn: cardOnPressIn,
        onPressOut: cardOnPressOut,
    }));

    useEffect(() => {
        if (focused) {
            // start animation
            titleTransformY.value = withSpring(0, { duration: 600 });
            goTransformY.value = withSpring(0, { duration: 600 });

            cardContentOpacity.value = withTiming(1, { duration: 600 });
        } else {
            // reset animation
            titleTransformY.value = withTiming(-initialTransformY, { duration: 600 });
            goTransformY.value = withTiming(initialTransformY, { duration: 600 });

            cardContentOpacity.value = withTiming(0, { duration: 600 });
        }
    }, [focused]);

    // TOP LEFT
    const dateObject = stringToDate(date);
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const day = dateObject.getDate();

    // TOP RIGHT
    let extra = ''
    const today = new Date();
    if (sameDay(today, dateObject)) {
        extra += 'Today';
    }
    if (dayIsYesterday(today, dateObject)) {
        extra += 'Yesterday';
    }

    return (
        <View style={style}>
            <ReactSpringAnimatedView style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 6,
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
                ...Styles.centeringContainer,
                transform: [{ scale: cardScale }]
            }}>

                {/* date & extras (top left and right) */}
                <View style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    top: 0,
                    width: '100%',
                    paddingHorizontal: 10,
                    justifyContent: 'space-between',
                }}>
                    <View style={{
                        alignItems: 'center',
                        paddingTop: 4,
                    }}>
                        <Text style={{
                            color: colors.textColor,
                            fontSize: 40,
                        }}>{day}</Text>
                        <Text style={{
                            color: colors.textColor,
                            fontSize: 20,
                        }}>{month}</Text>
                    </View>
                    <Text style={{
                        color: colors.textColor,
                        paddingTop: 8,
                        fontSize: 20,
                    }}>{extra}</Text>
                </View>

                {/* title */}
                <Animated.View style={{
                    padding: 30,
                    opacity: cardContentOpacity,
                    transform: [{ translateY: titleTransformY }]
                }}>
                    <Text style={{
                        color: colors.textColor,
                        fontSize: 40,
                    }}>{content.title}</Text>
                </Animated.View>


                {/* go button */}
                <Button
                    title='Go!'
                    backgroundColor={colors.textColor}
                    textColor={theme.white}
                    onPress={() => setContentModalVisible(true)}
                    reanimatedStyle={{
                        opacity: cardContentOpacity,
                        transform: [{ translateY: goTransformY }]
                    }}
                    style={{
                        width: '80%',
                        height: 50,
                    }}
                />


                {/* content modal */}
                <Modal visible={contentModalVisible} animationType='slide'>
                    <ContentModal date={date} completed={completed} content={content} colors={colors} closeModal={() => setContentModalVisible(false)} />
                </Modal>

            </ReactSpringAnimatedView>
        </View>
    );
});

export default memo(DateCard);