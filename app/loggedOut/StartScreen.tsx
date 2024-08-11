import { Button, Text } from '@/components/2d';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeContext, useFirebase } from '@/providers';
import { Styles } from '@/styles';
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
                    <SafeAreaView style={{
                        flex: 1,
                        ...Styles.centeringContainer,
                    }}>
                        <View style={{ flex: 1, ...Styles.centeringContainer }}>
                            <Text style={{
                                fontSize: 40,
                                textAlign: 'center',
                                color: theme.white,
                            }}>Welcome to Runway!</Text>
                        </View>
                        <View style={{ width: '100%', gap: 10, marginBottom: 20 }}>
                            <Button
                                title={'Get started!'}
                                onPress={() => {
                                    navigation.navigate('onboarding');
                                }}
                                style={{ width: "80%" }}
                            />
                            <Button
                                title={'I have an account'}
                                onPress={() => {
                                    navigation.navigate('login');
                                }}
                                style={{ width: "80%" }}
                            />
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </>
    );
};
