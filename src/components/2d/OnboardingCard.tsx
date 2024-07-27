import { Styles } from '@/styles';
import { dayIsYesterday, sameDay, stringToDate } from '@/utils/date';
import { Content, ContentColors, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, memo, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Easing, Pressable, View } from 'react-native';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import Button3D, { Button } from './Button';
import { QuestionContentChunk } from './ContentChunk';
import AnimatedNumbers from 'react-native-animated-numbers';



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
    const [points, setPoints] = useState(0);
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
        setPoints(99);
    }

    function resetColors() {
        setWrongButtonBackground1('#ffffff');
        setWrongButtonBackground2('#ffffff');
        setRightButtonBackground('#ffffff');
        setWrongButtonBackground3('#ffffff');
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
                    }}>See? You got the hang of it already!</Text>
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
                    }}>Answer questions correctly in less tries to earn more points!</Text>
                </AnimatedView>
            </View>
        )
    }
    else if (index === 5) {
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
                        fontSize: 40, textAlign: 'center', padding: 5, marginBottom: 15
                    }}>Earn more points to beat out your friends...</Text>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#FFD700', fontSize: 20 }}>1</Text>
                        <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginLeft: -20 }}>{username}</Text>
                        <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginRight: -70 }}>99</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20 }}>2</Text>
                        <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginLeft: -20 }}>bryan</Text>
                        <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginRight: -70 }}>35</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20 }}>3</Text>
                        <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20, marginLeft: -20 }}>isabelle</Text>
                        <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20, marginRight: -70 }}>20</Text>
                    </View>
                </AnimatedView>
            </View>
        )
    }
    else if (index === 6) {
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
                        fontSize: 40, textAlign: 'center', padding: 5, marginBottom: 15
                    }}>Or compete against the whole world!</Text>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#FFD700', fontSize: 20 }}>1</Text>
                        <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginLeft: -20 }}>bobby</Text>
                        <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginRight: -70 }}>100</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20 }}>2</Text>
                        <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginLeft: -20 }}>{username}</Text>
                        <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginRight: -70 }}>99</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20 }}>3</Text>
                        <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20, marginLeft: -20 }}>jess</Text>
                        <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20, marginRight: -70 }}>45</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center', marginBottom: 20
                    }}>
                        <Text style={{ flex: 1, color: '#ffffff', fontSize: 20 }}>4</Text>
                        <Text style={{ flex: 1, color: '#ffffff', fontSize: 20, marginLeft: -20 }}>bryan</Text>
                        <Text style={{ flex: 1, color: '#ffffff', fontSize: 20, marginRight: -70 }}>35</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        top: 0,
                        width: '80%', alignItems: 'center'
                    }}>
                        <Text style={{ flex: 1, color: '#ffffff', fontSize: 20 }}>5</Text>
                        <Text style={{ flex: 1, color: '#ffffff', fontSize: 20, marginLeft: -20 }}>isabelle</Text>
                        <Text style={{ flex: 1, color: '#ffffff', fontSize: 20, marginRight: -70 }}>20</Text>
                    </View>
                </AnimatedView>
            </View>
        )
    }
    else if (index === 7) {
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
                    <Text style={{
                        color: colors.textColor,
                        fontSize: 40, textAlign: 'center'
                    }}>So what are you waiting for? Let's get started!</Text>
                </AnimatedView>
            </View>
        )
    }



});

export default memo(DateCard);