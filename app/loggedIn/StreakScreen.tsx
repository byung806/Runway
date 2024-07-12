import { Styles } from "@/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { Easing, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { Button, Text, ThemeContext } from "~/2d";
import * as Haptics from "expo-haptics";
import AnimatedNumbers from 'react-native-animated-numbers';
import LottieView from 'lottie-react-native';


// i put this screen as a tab in the app just so you can easily access it
// but in the final app this screen will be hidden and pop up when the streak increases
export default function StreakScreen({ startingStreak }: { startingStreak: number }) {
    const theme = useContext(ThemeContext);

    const [streak, setStreak] = useState(startingStreak);

    // this useEffect is called when the streak variable changes
    // so when the streak changes, we can animate the icon or something
    // useEffect(() => {
    //     console.log('from StreakScreen.tsx:  useEffect');

    //     // i just made a really dumb animation here but i want u to make it better
    //     // you can learn how to use different reanimated functions here: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation
    //     scale.value = withSequence(
    //         withTiming(1.3, { duration: 100 }),
    //         withTiming(1, { duration: 100 }),
    //     )

    // }, [streak]);

    return (
        <View style={{
            flex: 1
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                {/* all of this is just random stuff i threw together to give an example */}
                {/* this is duolingo's animation for inspiration https://youtu.be/XL5ALfc2R-A?t=153 */}
                <LottieView
                    style={{
                        width: 500,
                        height: 500,
                        position: 'absolute',
                        top: 0,
                    }}
                    source={require('@/assets/pixelFire.json')}
                    autoPlay
                    loop
                />
                <AnimatedNumbers
                    animateToNumber={streak}
                    fontStyle={{ color: theme.textInverse, fontSize: 100, textAlign: 'center', fontFamily: 'Silkscreen_400Regular' }}
                    easing={Easing.out(Easing.cubic)}
                />
                {/* <Text style={{
                    color: theme.text,
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: 20,
                }}>Days in a row!</Text> */}

                <Button title="reset to 0 (dev)" onPress={() => setStreak(0)} style={{
                    zIndex: 1000,
                }} />
                <Button title="increment (dev)" onPress={() => setStreak(streak + 1)} style={{
                    zIndex: 1000,
                }} />
            </View>

        </View>
    );
}