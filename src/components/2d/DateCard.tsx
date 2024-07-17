import { Styles } from '@/styles';
import { dayIsYesterday, sameDay, stringToDate } from '@/utils/date';
import { useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { memo, useContext, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { lighten } from 'react-native-color-toolkit';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';


interface DateCardProps {
    date: string;
}

const AnimatedView = animated(View);

const DateCard = memo(function DateCard({ date, ...props }: DateCardProps & any) {
    // TODO: allowpress
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.94,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle
    });

    // TODO: fix flatlist making every datecard render everything
    const [color, setColor] = useState('');
    const [textColor, setTextColor] = useState('');
    const [borderColor, setBorderColor] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');

    useEffect(() => {
        setTextColor(lighten(color));
        setBorderColor(lighten(color, 0.5));
        setBackgroundColor(lighten(color, 1.2));
    }, [color]);

    useEffect(() => {
        const point_days = firebase.userData?.point_days;
        if (!point_days) return;
        if (date in point_days) {
            setColor('#03b76d');  // green
        } else {
            setColor('#444444');  // gray
        }
    }, []);

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
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={{ height: props.height }}>
            <AnimatedView style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 6,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
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
                        // borderWidth: 2,
                    }}>
                        <Text style={{
                            color: textColor,
                            fontSize: 40,
                        }}>{day}</Text>
                        <Text style={{
                            color: textColor,
                            fontSize: 20,
                        }}>{month}</Text>
                    </View>
                    <Text style={{
                        color: textColor,
                        paddingTop: 8,
                        fontSize: 20,
                    }}>{extra}</Text>
                </View>
                <Text style={{
                    color: textColor,
                    fontSize: 40,
                }}>{date}</Text>
            </AnimatedView>
        </Pressable>
    );
});

export default DateCard;