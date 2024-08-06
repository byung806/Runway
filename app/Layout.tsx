import { Text } from '@/components/2d';
import { useFirebase } from '@/providers';
import { usePushNotifications } from '@/utils/usePushNotifications';
import {
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    useFonts,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Animated, View } from 'react-native';
import { AppScreen, LeaderboardScreen, StreakScreen } from './loggedIn';
import { LoginScreen, OnboardingScreen, SignupScreen, StartScreen } from './loggedOut';


SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

const cardStyleInterpolator = ({
    current,
    next,
    inverted,
    layouts: { screen }
}: any) => {
    const progress = Animated.add(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp"
        }),
        next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: "clamp"
            })
            : 0
    );

    return {
        cardStyle: {
            transform: [
                {
                    translateX: Animated.multiply(
                        progress.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [
                                screen.width, // Focused, but offscreen in the beginning
                                0, // Fully focused
                                -screen.width
                            ],
                            extrapolate: "clamp"
                        }),
                        inverted
                    )
                }
            ]
        }
    };
};

export default function Layout() {
    // TODO: push notifications
    // const { expoPushToken, notification } = usePushNotifications()
    // const data = JSON.stringify(notification, undefined, 2)
    // token: expoPushToken?.data ?? ""

    const firebase = useFirebase();
    const [fontsLoaded] = useFonts({
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return;

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={firebase.userData ? 'app' : 'start'}
                    screenOptions={{
                        cardStyleInterpolator: cardStyleInterpolator,
                    }}
                >
                    {firebase.userData ?
                        (
                            <>
                                <Stack.Screen name="app" component={AppScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="streak" component={StreakScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false, gestureEnabled: false }} />
                                <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
                            </>
                        )
                    }
                    {/* <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false, gestureEnabled: false }} />
                    <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="logged_in_app" component={ScreenLayout} options={{ headerShown: false, gestureEnabled: false }} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}