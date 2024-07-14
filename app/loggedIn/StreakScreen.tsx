import { Styles } from "@/styles";
import FadeIn, { FadeInRef } from "@/utils/FadeIn";
import { delay } from "@/utils/utils";
import { useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { animated } from "@react-spring/native";
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useRef, useState } from "react";
import { Easing, View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { Button, Text, ThemeContext } from "~/2d";


const AnimatedButton = animated(Button);

export default function StreakScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);
    const focused = useIsFocused();

    const [streak, setStreak] = useState(props.startingStreak || 0);
    const [buttonClickable, setButtonClickable] = useState(false);

    const fadeInRef = useRef<FadeInRef>(null);

    const numberAnimationDuration = 1400;
    const fireAnimationRef = useRef<LottieView>(null);

    useEffect(() => {
        incrementStreak();
    }, []);

    useEffect(() => {
        if (buttonClickable) fadeInRef.current?.start();
    }, [buttonClickable]);

    useEffect(() => {
        if (!focused) {
            fireAnimationRef.current?.reset();
        }
    }, [focused]);

    async function incrementStreak() {
        await delay(700);
        setStreak(streak + 1);
        await delay(numberAnimationDuration + 100);
        fireAnimationRef.current?.play();
        await delay(300);
        setButtonClickable(true);
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.background,
        }}>
            <View style={{
                flex: 1,
                // ...Styles.centeringContainer,
                // ...Styles.debugBorder,
            }}>
                {/* all of this is just random stuff i threw together to give an example */}
                {/* this is duolingo's animation for inspiration https://youtu.be/XL5ALfc2R-A?t=153 */}
                <View style={{
                    flex: 1,
                    ...Styles.centeringContainer,
                }}>
                    <LottieView
                        ref={fireAnimationRef}
                        style={{
                            width: 500,
                            height: 500,
                            position: 'absolute',
                            top: 20,
                        }}
                        source={require('@/assets/pixelFire.json')}
                        loop
                    />
                    <AnimatedNumbers
                        animateToNumber={streak}
                        animationDuration={numberAnimationDuration}
                        fontStyle={{ color: theme.text, fontSize: 100, textAlign: 'center', fontFamily: 'Silkscreen_400Regular' }}
                        easing={Easing.out(Easing.cubic)}
                    />
                    <Text style={{
                        color: theme.text,
                        fontSize: 20,
                        textAlign: 'center',
                        marginBottom: 20,
                    }}>day streak</Text>
                </View>

                <View style={{
                    width: '90%',
                    position: 'absolute',
                    bottom: 0,
                    left: '5%',
                }}>
                    <FadeIn ref={fadeInRef}>
                        <AnimatedButton
                            style={{
                                marginBottom: 20,
                            }}
                            disabled={!buttonClickable}
                            title={'Continue'}
                            filled={false}
                            onPress={() => navigation.navigate('app')}
                        />
                    </FadeIn>
                </View>
            </View>

        </View>
    );
}