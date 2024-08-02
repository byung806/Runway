import { Button, Text, ThemeContext } from '@/components/2d';
import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import { delay } from "@/utils/utils";
import { useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from 'lottie-react-native';
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Easing, View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: make points the main thing here and have streak be a side thing
export default function StreakScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    // TODO: fix streak sometimes being 1 higher (getUserData faster than navigate??)
    const theme = useContext(ThemeContext);
    const focused = useIsFocused();
    const firebase = useFirebase();

    const [streak, setStreak] = useState(firebase.userData?.streak ?? 0);
    const [buttonClickable, setButtonClickable] = useState(false);

    const buttonOpacity = useSharedValue(0);

    const numberAnimationDuration = 800;
    const fireAnimationRef = useRef<LottieView>(null);

    const height = Dimensions.get('window').height;

    useEffect(() => {
        if (buttonClickable) buttonOpacity.value = withTiming(1, { duration: 300 });
    }, [buttonClickable]);

    useEffect(() => {
        if (focused) {
            incrementStreak();
        } else {
            fireAnimationRef.current?.reset();
        }
    }, [focused]);

    async function incrementStreak() {
        await delay(3000);
        setStreak(streak + 1);
        await delay(numberAnimationDuration + 100);
        fireAnimationRef.current?.play();
        await delay(300);
        setButtonClickable(true);
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
            }}>
                <Suspense fallback={null}>
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
                </Suspense>
                <AnimatedNumbers
                    animateToNumber={streak}
                    animationDuration={numberAnimationDuration}
                    fontStyle={{ color: theme.runwayTextColor, fontSize: 100, textAlign: 'center', fontFamily: 'Inter_700Bold' }}
                    easing={Easing.out(Easing.cubic)}
                />
                <Text style={{
                    color: theme.runwayTextColor,
                    fontSize: 20,
                    textAlign: 'center',
                    marginBottom: 20,
                }}>day streak</Text>
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