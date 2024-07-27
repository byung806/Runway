import { Styles } from '@/styles';
import { ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, memo, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Easing, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import { Button } from './Button';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import BorderedCard, { BorderedCardRef } from './BorderedCard';



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

const OnboardingCard = forwardRef(({ focused, colors, style, username, index }: OnboardingCardProps, ref) => {
    const theme = useContext(ThemeContext);

    const borderedCardRef = React.useRef<BorderedCardRef>(null);

    useImperativeHandle(ref, () => ({
        onPressIn: borderedCardRef.current?.onPressIn,
        onPressOut: borderedCardRef.current?.onPressOut,
    }));

    const [wrongButtonBackground1, setWrongButtonBackground1] = useState<string>('#ffffff');
    const [wrongButtonBackground2, setWrongButtonBackground2] = useState<string>('#ffffff');
    const [wrongButtonBackground3, setWrongButtonBackground3] = useState<string>('#ffffff');
    const [rightButtonBackground, setRightButtonBackground] = useState<string>('#ffffff');
    const [points, setPoints] = useState(0);


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
        setPoints(points + 99);
    }

    useEffect(() => {
        if (focused) {
            // console.log('start internal card slide animation for ', date);
            // start animation
        }
    }, [focused]);

    let insides: JSX.Element = <></>;
    if (index === 0) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center'
                }}>Welcome to Runway,</Text>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center'
                }}>{username}</Text>
            </>
        )
    } else if (index === 1) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center'
                }}>Complete daily lessons to earn points!</Text>
            </>
        )
    } else if (index === 2) {
        insides = (
            <>
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
                <View style={{ width: '100%', ...Styles.centeringContainer, padding: 30, gap: 10 }}>
                    <Text style={{ fontSize: 30, color: theme.white, ...Styles.lightShadow, marginBottom: 30 }}>What is the chemical formula for water?</Text>
                    <View style={{ width: '100%', gap: 3 }}>
                        <Button onPress={() => wrongAnswer1()} title='CO2' backgroundColor={wrongButtonBackground1} textColor={theme.white} style={{
                            width: '100%',
                            height: 50,
                        }} />
                        <Button onPress={() => wrongAnswer2()} title='NH3' backgroundColor={wrongButtonBackground2} textColor={theme.white} style={{
                            width: '100%',
                            height: 50,
                        }} />
                        <Button onPress={() => rightAnswer()} title='H2O' backgroundColor={rightButtonBackground} textColor={theme.white} style={{
                            width: '100%',
                            height: 50,
                        }} />
                        <Button onPress={() => wrongAnswer3()} title='NO2' backgroundColor={wrongButtonBackground3} textColor={theme.white} style={{
                            width: '100%',
                            height: 50,
                        }} />
                    </View>
                </View>
                <Text style={{ fontSize: 30, color: theme.white, ...Styles.lightShadow, marginBottom: 0 }}>Points:</Text>
                <AnimatedNumbers
                    animateToNumber={points}
                    animationDuration={800}
                    fontStyle={{ color: theme.white, fontSize: 30, textAlign: 'center', fontFamily: 'Inter_700Bold' }}
                    easing={Easing.out(Easing.cubic)}
                />
            </>
        )
    } else if (index === 3) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center'
                }}>See? You got the hang of it already!</Text>
            </>
        )
    } else if (index === 4) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30,
                    textAlign: 'center'
                }}>Answer questions correct in less tries to earn more points!</Text>
                <AnimatedNumbers
                    animateToNumber={points}
                    animationDuration={200}
                    fontStyle={{ color: theme.white, fontSize: 100, textAlign: 'center', fontFamily: 'Inter_700Bold' }}
                    easing={Easing.out(Easing.cubic)}
                />
            </>
        )
    }

    return (
        <BorderedCard ref={borderedCardRef} style={{ ...style, padding: 20 }} colors={colors}>
            {insides}
        </BorderedCard>
    );
});

export default memo(OnboardingCard);