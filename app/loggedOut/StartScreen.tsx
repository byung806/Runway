import { BorderedCard, Button, Text } from '@/components/2d';
import React, { useContext, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

import { ThemeContext, useFirebase } from '@/providers';
import { pastelPurple, Styles, yellowGreen, yellowOrange } from '@/styles';
import { BlurView } from '@react-native-community/blur';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';


export default function StartScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const backgroundColor = useSharedValue(theme.runwaySplashScreenBackgroundColor);
    const planeTransformY = useSharedValue(0);

    const opacity = useSharedValue(0);

    useEffect(() => {
        if (!firebase.initializing) {
            planeTransformY.value = withSpring(-600, { duration: 5000 });
            backgroundColor.value = withTiming(theme.runwayBackgroundColor, { duration: 1000 });
            opacity.value = withSpring(1, { duration: 1000 });
        }
    }, [firebase.initializing]);

    const padding = 30;
    const boxHeight = (Dimensions.get("window").width - padding * 2) * 1.4;

    return (
        <>
            <Animated.View style={{
                flex: 1, backgroundColor: backgroundColor
            }}>
                <Animated.Image
                    source={require('@/assets/logo.png')}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: [{ translateY: planeTransformY }],
                    }}
                    resizeMode="cover"
                />
                <Animated.View style={{ flex: 1, opacity: opacity }}>
                    <View
                        style={{
                            flex: 1,
                            ...Styles.centeringContainer,
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
                                height: boxHeight,
                                zIndex: 100
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
                                        color: theme.runwayTextColor,
                                    }}>Learn every day.</Text>
                                    <Text style={{
                                        fontSize: 20,
                                        textAlign: 'center',
                                        color: theme.runwayTextColor,
                                    }}>Have fun doing it.</Text>
                                </View>
                                <View style={{ width: '100%', gap: 10, marginBottom: 20 }}>
                                    <Button
                                        title={'Get started'}
                                        onPress={() => {
                                            navigation.navigate('onboarding');
                                        }}
                                        style={{ width: "80%" }}
                                    />
                                    <Button
                                        title={'Log in'}
                                        onPress={() => {
                                            navigation.navigate('login');
                                        }}
                                        style={{ width: "80%" }}
                                    />
                                </View>
                            </View>
                        </BorderedCard>

                        <BorderedCard
                            colors={yellowGreen}
                            style={{
                                position: 'absolute',
                                width: Dimensions.get("window").width - padding * 2,
                                height: boxHeight,
                                transform: [{ translateY: 250 }, { rotate: '44deg' }],
                            }}
                        />

                        <BorderedCard
                            colors={pastelPurple}
                            style={{
                                position: 'absolute',
                                width: Dimensions.get("window").width - padding * 2,
                                height: boxHeight,
                                transform: [{ translateY: -250 }, { translateX: 200 }, { rotate: '-54deg' }],
                            }}
                        />

                        <BorderedCard
                            colors={yellowOrange}
                            style={{
                                position: 'absolute',
                                width: Dimensions.get("window").width - padding * 2,
                                height: boxHeight,
                                transform: [{ translateY: 50 }, { translateX: -200 }, { rotate: '120deg' }],
                            }}
                        />

                        <BlurView
                            // blurType="ultraThinMaterialDark"
                            blurAmount={3}
                            reducedTransparencyFallbackColor="black"
                            style={{
                                zIndex: 99,
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </View>
                </Animated.View>
            </Animated.View>
        </>
    );
};
