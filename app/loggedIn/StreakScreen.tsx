import { Button, Text } from '@/components/2d';
import { useRunwayTheme, useFirebase } from "@/providers";
import { Styles } from "@/styles";
import { delay } from "@/utils/utils";
import { useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useRef, useState } from "react";
import { Easing, View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function StreakScreen({ route, navigation }: { route: any, navigation: StackNavigationProp<any, any> }) {
    const theme = useRunwayTheme();
    const focused = useIsFocused();
    const firebase = useFirebase();

    useEffect(() => {
        async function requestStreak() {
            if (!route.params?.date || !route.params?.pointsEarned || !route.params?.pointsPossible) {
                return;
            }
            await firebase.requestCompleteDate(route.params?.date, route.params?.pointsEarned / route.params?.pointsPossible * 100);
        }
        requestStreak();
    }, []);

    const [pointsEarned, setPointsEarned] = useState(route.params?.pointsEarned + route.params?.earnedStreakBonus);
    const [streak, setStreak] = useState(route.params?.initialStreak ?? 0);
    const [buttonClickable, setButtonClickable] = useState(false);

    const pointsOpacity = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    const numberAnimationDuration = 800;
    const fireAnimationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (focused) {
            incrementStreak();
        } else {
            fireAnimationRef.current?.reset();
        }
    }, [focused]);

    async function incrementStreak() {
        fireAnimationRef.current?.play();
        await delay(1000);

        setStreak(streak + 1);

        await delay(numberAnimationDuration + 300);
        pointsOpacity.value = withTiming(1, { duration: 300 });

        await delay(300);

        setButtonClickable(true);
        buttonOpacity.value = withTiming(1, { duration: 300 });
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.runwayBackgroundColor,
            ...Styles.centeringContainer
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
                gap: 40,
            }}>

                <Text style={{
                    color: theme.white,
                    fontSize: 30,
                    textAlign: 'center'
                }}>Great job today!</Text>

                {/* streak */}
                <View style={{ ...Styles.centeringContainer, position: 'relative' }}>
                    {/* <FontAwesome5 name='fire-alt' size={80} color={'#cc5500'} /> */}
                    <LottieView
                        ref={fireAnimationRef}
                        style={{
                            width: 200,
                            height: 200,
                            // position: 'absolute',
                            // top: -50,
                        }}
                        source={require('@/assets/animations/fire_2.json')}
                        loop
                    />
                    <View style={{
                        // position: 'absolute',
                        // top: 120,
                    }}>
                        <AnimatedNumbers
                            animateToNumber={streak}
                            animationDuration={numberAnimationDuration}
                            fontStyle={{ color: '#cc5500', fontSize: 80, textAlign: 'center', fontFamily: 'FredokaOne_400Regular' }}
                            easing={Easing.out(Easing.cubic)}
                        />
                    </View>
                </View>

                {/* points earned */}
                <Animated.View style={{ ...Styles.centeringContainer, opacity: pointsOpacity }}>
                    <Text style={{
                        color: theme.runwayTextColor,
                        fontSize: 30,
                        textAlign: 'center'
                    }}>Points Earned:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            color: theme.runwayTextColor,
                            fontSize: 60,
                            textAlign: 'center',
                        }}>
                            +{pointsEarned}
                        </Text>
                    </View>
                </Animated.View>
            </View>

            <SafeAreaView style={{
                width: '100%',
                position: 'absolute',
                bottom: 0,
            }} edges={['bottom']}>
                <Button
                    reanimatedStyle={{
                        opacity: buttonOpacity
                    }}
                    disabled={!buttonClickable}
                    title={'Continue'}
                    style={{ width: '80%', marginBottom: 20 }}
                    onPress={() => navigation.navigate('app')}
                />
            </SafeAreaView>
        </View>
    );
}