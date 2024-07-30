import { ContentColors } from '@/utils/FirebaseProvider';
import React, { forwardRef, memo, useContext, useImperativeHandle, useState } from 'react';
import { Easing, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import BorderedCard, { BorderedCardRef } from './BorderedCard';
import Button from './Button';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';


interface OnboardingCardProps {
    focused: boolean;
    colors: ContentColors;
    style: any;
    username: string;
    index: number;
    openOnboardingContentModal: () => void;
    closeOnboardingContentModal: () => void;
}

export interface OnboardingCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const OnboardingCard = forwardRef(({ focused, colors, style, username, index, openOnboardingContentModal, closeOnboardingContentModal }: OnboardingCardProps, ref) => {
    const theme = useContext(ThemeContext);

    const borderedCardRef = React.useRef<BorderedCardRef>(null);

    useImperativeHandle(ref, () => ({
        onPressIn: borderedCardRef.current?.onPressIn,
        onPressOut: borderedCardRef.current?.onPressOut,
    }));

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
                    onPress={openOnboardingContentModal}
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
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30,
                    textAlign: 'center'
                }}>You got</Text>
                <AnimatedNumbers
                    animateToNumber={200}
                    animationDuration={200}
                    fontStyle={{ color: theme.white, fontSize: 100, textAlign: 'center', fontFamily: 'Inter_700Bold' }}
                    easing={Easing.out(Easing.cubic)}
                />
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30,
                    textAlign: 'center'
                }}>points!</Text>
            </>
        )
    } else if (index === 3) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 35,
                    textAlign: 'center'
                }}>Answer questions correct in less tries to earn more points!</Text>
            </>
        )
    }else if (index === 4) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 35, textAlign: 'center', padding: 5, marginBottom: 15
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
    } else if (index === 5) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 35, textAlign: 'center', padding: 5, marginBottom: 15
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