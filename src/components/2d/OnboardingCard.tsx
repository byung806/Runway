import { ContentColors, ThemeContext } from '@/providers';
import { Styles } from '@/styles';
import React, { forwardRef, memo, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Easing, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import BorderedCard, { BorderedCardRef } from './BorderedCard';
import Button from './Button';
import Text from './Text';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LeaderboardEntry from './LeaderboardEntry';
import FontAwesome from '@expo/vector-icons/FontAwesome';



interface OnboardingCardProps {
    focused: boolean;
    colors: ContentColors;
    style: any;
    username: string;
    index: number;
    openOnboardingContentModal: () => void;
}

export interface OnboardingCardRef {
    onPressIn: () => void;
    onPressOut: () => void;
}

const OnboardingCard = forwardRef(({ focused, colors, style, username, index, openOnboardingContentModal }: OnboardingCardProps, ref) => {
    const theme = useContext(ThemeContext);

    const borderedCardRef = React.useRef<BorderedCardRef>(null);

    useImperativeHandle(ref, () => ({
        onPressIn: borderedCardRef.current?.onPressIn,
        onPressOut: borderedCardRef.current?.onPressOut,
    }));

    const [points, setPoints] = useState(0);

    const opacity = useSharedValue(0);
    useEffect(() => {
        if (focused) {
            opacity.value = withTiming(1, { duration: 600 });
        }
    }, [focused]);

    let insides: JSX.Element = <></>;
    if (index === 0) {
        insides = (
            <View style={{ gap: 10, ...Styles.centeringContainer }}>
                <FontAwesome5 name="user-friends" size={36} color={colors.textColor} />
                <Text style={{
                    color: colors.textColor,
                    fontSize: 36,
                    textAlign: 'center'
                }}>
                    Welcome to Runway,
                    <Text style={{ color: colors.textColor }}> {username}</Text>
                    !
                </Text>
                <Text style={{
                    color: theme.runwaySubTextColor,
                    fontSize: 24,
                    textAlign: 'center'
                }}>
                    Every day, a new lesson will appear.
                </Text>
            </View>
        )
    } else if (index === 1) {
        insides = (
            <View style={{ gap: 10, ...Styles.centeringContainer }}>
                <AntDesign name="star" size={36} color={colors.textColor} />
                <Text style={{ color: colors.textColor, fontSize: 30 }}> Let's try one out!</Text>
            </View>
        )
    } else if (index === 2) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 40,
                    textAlign: 'center',
                    marginBottom: 20
                }}>Auroras</Text>
                <Button
                    title='Learn!'
                    backgroundColor={colors.textColor}
                    textColor={theme.white}
                    onPress={openOnboardingContentModal}
                    style={{
                        width: '80%',
                        height: 50,
                    }}
                />
            </>
        )
    } else if (index === 3) {
        useEffect(() => {
            if (focused) {
                setPoints(200);
            }
        }, [focused]);

        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30,
                    textAlign: 'center'
                }}>You got</Text>
                <AnimatedNumbers
                    animateToNumber={points}
                    animationDuration={800}
                    fontStyle={{ color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 100, textAlign: 'center', fontFamily: 'FredokaOne_400Regular' }}
                    easing={Easing.out(Easing.cubic)}
                />
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30,
                    textAlign: 'center'
                }}>points!</Text>
            </>
        )
    } else if (index === 4) {
        insides = (
            <>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30,
                    textAlign: 'center'
                }}>Answer questions correctly in less tries to earn more points!</Text>
            </>
        )
    } else if (index === 5) {
        insides = (
            <>
                <FontAwesome name={'trophy'} size={60} color={theme.trophyYellow} />
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30, textAlign: 'center', padding: 5, marginBottom: 15
                }}>Earn more points to beat out your friends...</Text>
                <View style={{
                    flexDirection: 'row',
                    top: 0,
                    width: '80%', alignItems: 'center', marginBottom: 20
                }}>
                    <Text style={{ flex: 1, color: '#FFD700', fontSize: 20 }}>1</Text>
                    <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginLeft: -20 }}>{username}</Text>
                    <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginRight: -70 }}>200</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    top: 0,
                    width: '80%', alignItems: 'center', marginBottom: 20
                }}>
                    <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20 }}>2</Text>
                    <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginLeft: -20 }}>bryan</Text>
                    <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginRight: -70 }}>110</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    top: 0,
                    width: '80%', alignItems: 'center', marginBottom: 20
                }}>
                    <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20 }}>3</Text>
                    <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20, marginLeft: -20 }}>isabelle</Text>
                    <Text style={{ flex: 1, color: '#CD7F32', fontSize: 20, marginRight: -70 }}>45</Text>
                </View>
            </>
        )
    } else if (index === 6) {
        insides = (
            <>
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                }}>
                    <FontAwesome name={'trophy'} size={60} color={theme.trophyYellow} />
                    <FontAwesome name={'trophy'} size={60} color={theme.trophyYellow} />
                    <FontAwesome name={'trophy'} size={60} color={theme.trophyYellow} />
                </View>
                <Text style={{
                    color: colors.textColor,
                    fontSize: 30, textAlign: 'center', padding: 5, marginBottom: 15
                }}>Or compete against the whole world!</Text>

                {/* <LeaderboardEntry place={1} name='bobby' streak={0} points={650} />
                <LeaderboardEntry place={2} name={username} streak={0} points={200} /> */}

                <View style={{
                    flexDirection: 'row',
                    top: 0,
                    width: '80%', alignItems: 'center', marginBottom: 20
                }}>
                    <Text style={{ flex: 1, color: '#FFD700', fontSize: 20 }}>1</Text>
                    <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginLeft: -20 }}>bobby</Text>
                    <Text style={{ flex: 1, color: '#FFD700', fontSize: 20, marginRight: -70 }}>650</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    top: 0,
                    width: '80%', alignItems: 'center', marginBottom: 20
                }}>
                    <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20 }}>2</Text>
                    <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginLeft: -20 }}>{username}</Text>
                    <Text style={{ flex: 1, color: '#BCC6CC', fontSize: 20, marginRight: -70 }}>200</Text>
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
                    <Text style={{ flex: 1, color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 20 }}>4</Text>
                    <Text style={{ flex: 1, color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 20, marginLeft: -20 }}>bryan</Text>
                    <Text style={{ flex: 1, color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 20, marginRight: -70 }}>35</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    top: 0,
                    width: '80%', alignItems: 'center'
                }}>
                    <Text style={{ flex: 1, color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 20 }}>5</Text>
                    <Text style={{ flex: 1, color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 20, marginLeft: -20 }}>isabelle</Text>
                    <Text style={{ flex: 1, color: theme.scheme === 'dark' ? theme.white : theme.black, fontSize: 20, marginRight: -70 }}>20</Text>
                </View>
            </>
        )
    }


    if (index === 2) {
        return (
            <BorderedCard ref={borderedCardRef} style={{ ...style }} colors={colors}>
                <Animated.View style={{ width: '100%', ...Styles.centeringContainer, opacity }}>
                    {insides}
                </Animated.View>
            </BorderedCard>
        );
    }
    return (
        <Animated.View style={{ ...style, width: '100%', ...Styles.centeringContainer, paddingHorizontal: 30, opacity }}>
            {insides}
        </Animated.View>
    );
});

export default memo(OnboardingCard);