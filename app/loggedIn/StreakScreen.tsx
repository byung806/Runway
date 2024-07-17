import { Styles } from "@/styles";
import FadeIn, { FadeInRef } from "@/utils/FadeIn";
import { useFirebase } from "@/utils/FirebaseProvider";
import { delay } from "@/utils/utils";
import { useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { animated } from "@react-spring/native";
import LottieView from 'lottie-react-native';
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Easing, View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, ThemeContext } from "~/2d";


const AnimatedButton = animated(Button);

export default function StreakScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);
    const focused = useIsFocused();
    const firebase = useFirebase();

    const [streak, setStreak] = useState(firebase.userData?.streak ?? 0);
    const [buttonClickable, setButtonClickable] = useState(false);

    const fadeInRef = useRef<FadeInRef>(null);

    const numberAnimationDuration = 800;
    const fireAnimationRef = useRef<LottieView>(null);

    const height = Dimensions.get('window').height;

    useEffect(() => {
        if (buttonClickable) fadeInRef.current?.start();
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
            backgroundColor: theme.background,
        }}>
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: 1,
                    ...Styles.centeringContainer,
                }}>
                    {/* TODO: figure out suspense and why its being laggy */}
                    <Suspense fallback={null}>
                        <LottieView
                            ref={fireAnimationRef}
                            style={{
                                width: 500,
                                height: 500,
                                position: 'absolute',
                                top: height - 740,
                            }}
                            source={require('@/assets/pixelFire.json')}
                            loop
                        />
                    </Suspense>
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
                    <SafeAreaView style={{
                        flex: 1
                    }} edges={['bottom']}>
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
                    </SafeAreaView>
                </View>
            </View>

        </View>
    );
}