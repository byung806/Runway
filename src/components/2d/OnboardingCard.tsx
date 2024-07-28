import { Styles } from '@/styles';
import { ContentColors } from '@/utils/FirebaseProvider';
import React, { forwardRef, memo, useContext, useImperativeHandle, useState } from 'react';
import { Easing, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import BorderedCard, { BorderedCardRef } from './BorderedCard';
import { QuestionContentChunk } from './ContentChunk';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import Button from './Button';



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

const OnboardingCard = forwardRef(({ focused, colors, style, username, index }: OnboardingCardProps, ref) => {
    const theme = useContext(ThemeContext);

    const borderedCardRef = React.useRef<BorderedCardRef>(null);

    useImperativeHandle(ref, () => ({
        onPressIn: borderedCardRef.current?.onPressIn,
        onPressOut: borderedCardRef.current?.onPressOut,
    }));

    const [points, setPoints] = useState(0);

    let insides: JSX.Element = <></>;
    if (index === 0) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center'
                }}>Welcome to Runway, {username}!</Text>
            </>
        )
    } else if (index === 1) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center',
                    marginBottom: 20
                }}>Complete cards like these to earn points!</Text>
                <Button
                    title='Go!'
                    backgroundColor={colors.textColor}
                    textColor={theme.black}
                    onPress={() => {}}
                    style={{
                        width: '80%',
                        height: 50,
                    }}
                />
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
                <QuestionContentChunk
                    question={'What is the chemical formula for water?'}
                    choices={[
                        { choice: 'CO2', correct: false },
                        { choice: 'NH3', correct: false },
                        { choice: 'H2O', correct: true },
                        { choice: 'NO2', correct: false },
                    ]}
                    focused={true}
                    colors={{
                        textColor: colors.textColor,
                        backgroundColor: colors.backgroundColor,
                        borderColor: colors.borderColor,
                        outerBackgroundColor: colors.outerBackgroundColor,
                    }}
                />
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
    } else if (index === 5) {
        insides = (
            <>
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
            </>
        )
    } else if (index === 6) {
        insides = (
            <>
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