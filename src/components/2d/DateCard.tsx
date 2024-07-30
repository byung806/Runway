import { dayIsYesterday, getTodayDate, sameDay, stringToDate } from '@/utils/date';
import { Content, ContentColors } from '@/utils/FirebaseProvider';
import { forwardRef, memo, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import BorderedCard, { BorderedCardRef } from './BorderedCard';
import Button from './Button';
import ContentModal from './ContentModal';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';


interface DateCardProps {
    focused: boolean;
    cardCompleted: boolean;
    date: string;
    content: Content;
    colors: ContentColors;
    requestCompleteDate: (date?: string) => Promise<void>;
    style: any;
}

export interface DateCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const DateCard = forwardRef(({ focused, cardCompleted, date, content, colors, requestCompleteDate, style }: DateCardProps, ref) => {
    const theme = useContext(ThemeContext);

    const borderedCardRef = useRef<BorderedCardRef>(null);

    useImperativeHandle(ref, () => ({
        onPressIn: borderedCardRef.current?.onPressIn,
        onPressOut: borderedCardRef.current?.onPressOut,
    }));

    const [contentModalVisible, setContentModalVisible] = useState(false);

    const initialTransformY = 80;
    const titleTransformY = useSharedValue(-initialTransformY);
    const goTransformY = useSharedValue(initialTransformY);

    const cardContentOpacity = useSharedValue(0);
    // TODO: gray out if completed

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
    const today = stringToDate(getTodayDate());
    if (sameDay(today, dateObject)) {
        extra += 'Today';
    }
    if (dayIsYesterday(today, dateObject)) {
        extra += 'Yesterday';
    }

    return (
        <BorderedCard ref={borderedCardRef} style={style} colors={colors}>
            <>
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

                {cardCompleted &&
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        marginBottom: 20,
                        width: '100%',
                    }}>
                        <Text style={{
                            color: colors.textColor,
                            fontSize: 20,
                            textAlign: 'center',
                        }}>Card Completed!</Text>
                    </View>
                }

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
                <ContentModal
                    visible={contentModalVisible}
                    closeModal={() => { setContentModalVisible(false) }}
                    date={date}
                    cardCompleted={cardCompleted}
                    content={content}
                    colors={colors}
                    requestCompleteDate={requestCompleteDate}
                />
            </>
        </BorderedCard>
    );
});

export default memo(DateCard);