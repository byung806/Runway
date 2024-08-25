import { ContentProvider, ThemeContext } from '@/providers';
import { ContentColors, FirebaseContent, useFirebase } from '@/providers/FirebaseProvider';
import { Styles } from '@/styles';
import { sameDay, stringToDate } from '@/utils/date';
import { AntDesign } from "@expo/vector-icons";
import { forwardRef, memo, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import BorderedCard, { BorderedCardRef } from './BorderedCard';
import Button from './Button';
import ContentModal from './ContentModal';
import Text from './Text';


interface DateCardProps {
    comingSoon?: boolean;

    date: string;
    content: FirebaseContent;
    colors: ContentColors;

    focused: boolean;

    style: any;
}

export interface DateCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

// TODO: show streak indicator on card
const DateCard = forwardRef(({ comingSoon = false, date, content, colors, focused, style }: DateCardProps, ref) => {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const borderedCardRef = useRef<BorderedCardRef>(null);

    useImperativeHandle(ref, () => ({
        onPressIn: borderedCardRef.current?.onPressIn,
        onPressOut: borderedCardRef.current?.onPressOut,
    }));

    const comingSoonCardOpacity = useSharedValue(comingSoon ? 1 : 0);
    const normalCardOpacity = useSharedValue(comingSoon ? 0 : 1);

    const cardCompleted = date in (firebase.userData?.point_days ?? {});
    const pointsEarnedIfCompleted = cardCompleted ? firebase.userData?.point_days[date] : 0;

    const [contentModalVisible, setContentModalVisible] = useState(false);

    const initialTransformY = 80;
    const titleTransformY = useSharedValue(-initialTransformY);
    const goTransformY = useSharedValue(initialTransformY);

    const cardContentOpacity = useSharedValue(0);

    // Fade animation
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
    const today = stringToDate(firebase.today);
    const isToday = sameDay(today, dateObject);
    if (isToday) {
        extra += 'Today';
    }
    // if (dayIsYesterday(today, dateObject)) {
    //     extra += 'Yesterday';
    // }

    return (
        <BorderedCard ref={borderedCardRef} style={style} newBadge={isToday && !cardCompleted} colors={colors}>
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
                    {/* <View style={{
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
                    </View> */}
                    <Text style={{
                        color: colors.textColor,
                        paddingTop: 8,
                        fontSize: 20,
                    }}>{extra}</Text>
                    {cardCompleted &&
                        <View style={{ paddingTop: 8 }}>
                            <AntDesign name={'checkcircle'} size={30} color={theme.black} style={{ ...Styles.shadow }} />
                        </View>
                    }
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
                        <Text style={{
                            color: colors.textColor,
                            fontSize: 15,
                            textAlign: 'center',
                        }}>+{pointsEarnedIfCompleted}</Text>
                    </View>
                }

                {/* title */}
                <Animated.View style={{
                    paddingBottom: 20,
                    paddingHorizontal: 30,
                    opacity: cardContentOpacity,
                    transform: [{ translateY: titleTransformY }]
                }}>
                    <Text style={{
                        color: colors.textColor,
                        fontSize: 40,
                    }} numberOfLines={3}>{content.title}</Text>
                </Animated.View>


                {/* go button */}
                <View pointerEvents={focused ? 'auto' : 'none'} style={{
                    width: '80%',
                    height: 50,
                }}>
                    <Button
                        title={cardCompleted ? 'Review!' : 'Learn!'}
                        backgroundColor={colors.textColor}
                        textColor={theme.white}
                        onPress={() => setContentModalVisible(true)}
                        reanimatedStyle={{
                            opacity: cardContentOpacity,
                            transform: [{ translateY: goTransformY }]
                        }}
                        style={{
                            width: '100%',
                        }}
                    />
                </View>


                {/* content modal */}
                <ContentProvider
                    date={date}
                    content={content}
                    colors={colors}
                    openContentModal={() => setContentModalVisible(true)}
                    closeContentModal={() => setContentModalVisible(false)}
                >
                    <ContentModal visible={contentModalVisible} />
                </ContentProvider>
            </>
        </BorderedCard>
    );
});

export default memo(DateCard);