import { Styles } from '@/styles';
import { dayIsYesterday, sameDay, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { forwardRef, memo, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import Button3D, { Button } from './Button';


interface OnboardingCardProps {
    focused: boolean;
    colors: ContentColors;
    style: any;
    username: string;
    index: number;
}

export interface OnboardingCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const AnimatedView = animated(View);

const DateCard = forwardRef(({ focused, colors, style, username, index }: OnboardingCardProps, ref) => {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const [wrongButtonBackground1, setWrongButtonBackground1] = useState<string>('ffffff');
    const [wrongButtonBackground2, setWrongButtonBackground2] = useState<string>('ffffff');
    const [wrongButtonBackground3, setWrongButtonBackground3] = useState<string>('ffffff');
    const [rightButtonBackground, setRightButtonBackground] = useState<string>('ffffff');
    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.94,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle
    });

    function wrongAnswer1() {
        setWrongButtonBackground1('#FF0000');
    }

    function wrongAnswer2() {
        setWrongButtonBackground2('#FF0000');
    }

    function wrongAnswer3() {
        setWrongButtonBackground3('#FF0000');
    }

    function rightAnswer() {
        setRightButtonBackground('#00FF00');
    }

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

    if (index === 0) {
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
                        textAlign: 'center'
                    }}>Welcome to Runway,</Text>
                    <Text style={{ color: colors.textColor, fontSize: 40, textAlign: 'center' }}>{username}</Text>
                </AnimatedView>
            </View>
        )
    }
    else if (index === 1) {
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
                        fontSize: 40, textAlign: 'center'
                    }}>Complete daily lessons to earn points!</Text>
                </AnimatedView>
            </View>
        )
    }
    else if (index === 2) {
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
                        fontSize: 40, textAlign: 'center'
                    }}>What's the chemical formula for water?</Text>
                    <Button3D title="CO2" onPress={wrongAnswer1} filled={false} backgroundColor={wrongButtonBackground1} height={200} width='80%' style={{ padding: 3 }} />
                    <Button3D title="NH3" onPress={wrongAnswer2} filled={false} backgroundColor={wrongButtonBackground2} height={200} width='80%' style={{ padding: 3 }} />
                    <Button3D title="H2O" onPress={rightAnswer} filled={false} backgroundColor={rightButtonBackground} height={200} width='80%' style={{ padding: 3 }} />
                    <Button3D title="O2" onPress={wrongAnswer3} filled={false} backgroundColor={wrongButtonBackground3} height={200} width='80%' style={{ padding: 3 }} />
                </AnimatedView>
            </View>
        )
    }
    else if (index === 3) {
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
                        fontSize: 40, textAlign: 'center'
                    }}>Earn points to climb up the global leaderboard...</Text>
                </AnimatedView>
            </View>
        )
    }
    else if (index === 4) {
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
                        fontSize: 40, textAlign: 'center'
                    }}>Or compete against your friends!</Text>
                </AnimatedView>
            </View>
        )
    }
});

export default memo(DateCard);