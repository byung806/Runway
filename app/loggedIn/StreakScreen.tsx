import { Button, Text } from '@/components/2d';
import { ThemeContext, useFirebase } from "@/providers";
import { Styles } from "@/styles";
import { delay } from "@/utils/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import { Easing, View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StreakScreen({ route, navigation }: { route: any, navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const focused = useIsFocused();
    const firebase = useFirebase();

    useEffect(() => {
        async function requestStreak() {
            const { success } = await firebase.requestCompleteDate(route.params?.date, route.params?.pointsEarned / route.params?.pointsPossible * 100);
            if (success) {
                await firebase.getUserData();
                await firebase.getLeaderboard('global');
                // TODO: update friends leaderboard too if rank is ever implemented
            } else {
                console.log('Something went wrong - today completed but database request failed');
            }
        }
        requestStreak();
    }, []);

    const pointsTextColor = useSharedValue(theme.runwayTextColor);

    const [pointsEarned, setPointsEarned] = useState(route.params?.pointsEarned ?? 0);
    const [streak, setStreak] = useState(route.params?.initialStreak ?? 0);
    const [buttonClickable, setButtonClickable] = useState(false);

    const buttonOpacity = useSharedValue(0);

    const numberAnimationDuration = 800;
    // const fireAnimationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (focused) {
            incrementStreak();
        } else {
            // fireAnimationRef.current?.reset();
        }
    }, [focused]);

    async function incrementStreak() {
        await delay(1000);

        setStreak(streak + 1);

        setPointsEarned(pointsEarned + route.params?.earnedStreakBonus);
        pointsTextColor.value = withTiming('#cc5500', { duration: 300 });
        await delay(numberAnimationDuration + 600);

        // fireAnimationRef.current?.play();
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
                {/* <Suspense fallback={null}>
                    <LottieView
                        ref={fireAnimationRef}
                        style={{
                            width: 500,
                            height: 500,
                            position: 'absolute',
                            top: height - 720,
                        }}
                        source={require('@/assets/animations/nonPixelFire.json')}
                        loop
                    />
                </Suspense> */}

                <Text style={{
                    color: theme.white,
                    fontSize: 30,
                    textAlign: 'center'
                }}>Great job today!</Text>

                {/* streak */}
                <View style={{ ...Styles.centeringContainer, flexDirection: 'row', gap: 10 }}>
                    <FontAwesome5 name='fire-alt' size={80} color={'#cc5500'} />
                    <AnimatedNumbers
                        animateToNumber={streak}
                        animationDuration={numberAnimationDuration}
                        fontStyle={{ color: '#cc5500', fontSize: 80, textAlign: 'center', fontFamily: 'Inter_700Bold' }}
                        easing={Easing.out(Easing.cubic)}
                    />
                </View>

                {/* points earned */}
                <View style={{ ...Styles.centeringContainer }}>
                    <Text style={{
                        color: theme.runwayTextColor,
                        fontSize: 30,
                        textAlign: 'center'
                    }}>Points Earned:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            color: theme.runwayTextColor,
                            fontSize: 100,
                            textAlign: 'center',
                        }}>
                            +
                        </Text>
                        <AnimatedNumbers
                            animateToNumber={pointsEarned}
                            animationDuration={numberAnimationDuration + 200}
                            fontStyle={{ color: theme.runwayTextColor, fontSize: 100, textAlign: 'center', fontFamily: 'Inter_700Bold' }}
                            easing={Easing.out(Easing.cubic)}
                        />
                    </View>
                </View>
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