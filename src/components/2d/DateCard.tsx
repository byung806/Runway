import { Styles } from '@/styles';
import { dayIsYesterday, sameDay, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { forwardRef, memo, useContext, useEffect, useImperativeHandle } from 'react';
import { View } from 'react-native';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';


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

const AnimatedView = animated(View);

const DateCard = forwardRef(({ focused, completed, date, content, colors, style }: DateCardProps, ref) => {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.94,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle
    });

    useImperativeHandle(ref, () => ({
        onPressIn,
        onPressOut,
    }));

    useEffect(() => {
        if (focused) {
            // console.log('start internal card slide animation for ', date);
            // start animation
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
            <AnimatedView style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 6,
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
                ...Styles.centeringContainer,
                transform: [{ scale: scale }]
            }}>
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
                {/* <Button title="Complete" filled={false} onPress={() => {}} /> */}
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                }}>{content.title}</Text>
            </AnimatedView>
        </View>
    );
});

export default memo(DateCard);