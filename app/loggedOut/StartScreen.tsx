import { BorderedCard, Button, Text } from '@/components/2d';
import React, { useContext, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

import { ThemeContext, useFirebase } from '@/providers';
import { pastelPurple, Styles, yellowGreen, yellowOrange } from '@/styles';
import { BlurView } from '@react-native-community/blur';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { delay } from '@/utils/utils';
import { useIsFocused } from '@react-navigation/native';


export default function StartScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const focused = useIsFocused();

    useEffect(() => {
        if (focused) {
            animateCardsIn();
        }
    }, [focused]);

    const opacity = useSharedValue(0);

    // const mainCardTranslateY = useSharedValue(0);
    // const card1TranslateY = useSharedValue(250);
    // const card2TranslateX = useSharedValue(200);
    // const card3TranslateX = useSharedValue(-200);
    const mainCardTranslateY = useSharedValue(-600);
    const card1TranslateY = useSharedValue(800);
    const card2TranslateX = useSharedValue(600);
    const card3TranslateX = useSharedValue(-600);

    async function animateCardsOut() {
        mainCardTranslateY.value = withSpring(-700, {
            mass: 1,
            damping: 30,
            stiffness: 100,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
        });
        card1TranslateY.value = withTiming(800, { duration: 1000 });
        card2TranslateX.value = withTiming(600, { duration: 1000 });
        card3TranslateX.value = withTiming(-600, { duration: 1000 });
        await delay(300);
    }

    async function animateCardsIn() {
        mainCardTranslateY.value = withSpring(0, {
            mass: 1,
            damping: 30,
            stiffness: 100,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
        });
        card1TranslateY.value = withTiming(300, { duration: 1000 });
        card2TranslateX.value = withTiming(200, { duration: 1000 });
        card3TranslateX.value = withTiming(-200, { duration: 1000 });
        await delay(300);
    }

    async function onGetStartedPress() {
        await animateCardsOut();
        navigation.navigate('onboarding');
    }

    async function onLoginPress() {
        await animateCardsOut();
        navigation.navigate('login');
    }

    useEffect(() => {
        if (!firebase.initializing) {
            opacity.value = withSpring(1, { duration: 1700 });
        }
    }, [firebase.initializing]);

    const padding = 30;
    const boxHeight = (Dimensions.get("window").width - padding * 2) * 1.4;

    return (
        <>
            <Animated.View style={{
                flex: 1, backgroundColor: theme.runwayOuterBackgroundColor,
            }}>
                {/* <Animated.Image
                    source={require('@/assets/logo.png')}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: [{ translateY: planeTransformY }],
                    }}
                    resizeMode="cover"
                /> */}
                <Animated.View style={{ flex: 1, opacity: opacity }}>
                    <View
                        style={{
                            flex: 1,
                            ...Styles.centeringContainer,
                        }}
                    >
                        <Animated.View
                            style={{
                                transform: [{ translateY: mainCardTranslateY }],
                                zIndex: 100
                            }}
                        >
                            <BorderedCard
                                colors={{
                                    textColor: theme.runwayTextColor,
                                    backgroundColor: theme.runwayBackgroundColor,
                                    borderColor: theme.runwayBorderColor,
                                    outerBackgroundColor: theme.runwayOuterBackgroundColor,
                                }}
                                style={{
                                    width: Dimensions.get("window").width - padding * 2,
                                    height: boxHeight
                                }}
                            >
                                <View style={{ width: '100%', gap: 40, padding: 30 }}>
                                    <View style={{ gap: 5 }}>
                                        <Text style={{
                                            fontSize: 40,
                                            textAlign: 'center',
                                            color: theme.runwayTextColor,
                                        }}>Runway</Text>
                                        <Text style={{
                                            fontSize: 20,
                                            textAlign: 'center',
                                            color: theme.runwaySubTextColor,
                                        }}>Learn every day.</Text>
                                        <Text style={{
                                            fontSize: 20,
                                            textAlign: 'center',
                                            color: theme.runwaySubTextColor,
                                        }}>Have fun doing it.</Text>
                                    </View>
                                    <View style={{ width: '100%', gap: 10, marginBottom: 20 }}>
                                        <Button
                                            title={'Get started'}
                                            onPress={onGetStartedPress}
                                            style={{ width: "80%" }}
                                        />
                                        <Button
                                            title={'Log in'}
                                            onPress={onLoginPress}
                                            style={{ width: "80%" }}
                                        />
                                    </View>
                                </View>
                            </BorderedCard>
                        </Animated.View>

                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: Dimensions.get("window").width - padding * 2,
                                height: boxHeight,
                                transform: [{ translateY: card1TranslateY }, {translateX: 150}, { rotate: '44deg' }],
                            }}
                        >
                            <BorderedCard
                                colors={yellowGreen}
                                style={{
                                    flex: 1
                                }}
                            />
                        </Animated.View>

                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: Dimensions.get("window").width - padding * 2,
                                height: boxHeight,
                                transform: [{ translateY: -250 }, { translateX: card2TranslateX }, { rotate: '-54deg' }],
                            }}
                        >
                            <BorderedCard
                                colors={pastelPurple}
                                style={{
                                    flex: 1
                                }}
                            />
                        </Animated.View>

                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: Dimensions.get("window").width - padding * 2,
                                height: boxHeight,
                                transform: [{ translateY: 50 }, { translateX: card3TranslateX }, { rotate: '120deg' }],
                            }}
                        >
                            <BorderedCard
                                colors={yellowOrange}
                                style={{
                                    flex: 1
                                }}
                            />
                        </Animated.View>

                        {/* <BlurView
                            // blurType="ultraThinMaterialDark"
                            blurAmount={3}
                            reducedTransparencyFallbackColor="black"
                            style={{
                                zIndex: 99,
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        /> */}
                    </View>
                </Animated.View>
            </Animated.View>
        </>
    );
};
