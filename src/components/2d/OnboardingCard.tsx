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


interface OnboardingCardProps {
    focused: boolean;
    colors: ContentColors;
    style: any;
}

export interface OnboardingCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const AnimatedView = animated(View);

const DateCard = forwardRef(({ focused, colors, style }: OnboardingCardProps, ref) => {
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
                </View>
                {/* <Button title="Complete" filled={false} onPress={() => {}} /> */}
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                }}>Title</Text>
            </AnimatedView>
        </View>
    );
});

export default memo(DateCard);