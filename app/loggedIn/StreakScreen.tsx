import { Styles } from "@/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { Button, Text, ThemeContext } from "~/2d";
import * as Haptics from "expo-haptics";
import AnimatedNumbers from 'react-native-animated-numbers';
import LottieView from 'lottie-react-native';


// i put this screen as a tab in the app just so you can easily access it
// but in the final app this screen will be hidden and pop up when the streak increases
export default function StreakScreen() {
    const theme = useContext(ThemeContext);

    const [streak, setStreak] = useState(0);

    // TODO: animate the streak icon and the number transition (u can choose how to animate it)
    // this scale variable is just a variable representing a number that can be animated
    const scale = useSharedValue<number>(2);

    // this animatedScale variable is a style that can be applied to a component
    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // this useEffect is called when the streak variable changes
    // so when the streak changes, we can animate the icon or something
    useEffect(() => {
        console.log('from StreakScreen.tsx:  useEffect');

        // i just made a really dumb animation here but i want u to make it better
        // you can learn how to use different reanimated functions here: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation
        scale.value = withSequence(
            withTiming(1.3, {duration: 100}),
            withTiming(1, {duration: 100}),
        )

    }, [streak]);

    return (
        <View style={{
            flex: 1
        }}>
            <LottieView
                    source={require('@/assets/fire1.json')}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}/>
            <Animated.View style={[{
                flex: 1,
                ...Styles.centeringContainer,
            }, animatedScale]}>
                {/* all of this is just random stuff i threw together to give an example */}
                {/* this is duolingo's animation for inspiration https://youtu.be/XL5ALfc2R-A?t=153 */}
                <Button title="reset to 0 (dev)" onPress={() => setStreak(0)} />
                <Button title="increment (dev)" onPress={() => setStreak(streak + 100)} />
                <MaterialCommunityIcons name="fire" size={100} color={theme.accent} />
                <AnimatedNumbers animateToNumber={streak} fontStyle={{color: theme.text, fontSize:100, textAlign: 'center', fontFamily: 'Silkscreen_400Regular'}}/>

                <Text style={{
                    color: theme.text,
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: 20,
                }}>Days in a row!</Text>
            </Animated.View>

        </View>
    );
}