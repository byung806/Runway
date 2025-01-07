import { ThemeContext, useFirebase } from '@/providers';
import {
    LilitaOne_400Regular,
    // LilitaOne_800Bold,
    // LilitaOne_900Black,
    useFonts,
} from '@expo-google-fonts/lilita-one';
import {
    FredokaOne_400Regular,
} from '@expo-google-fonts/fredoka-one';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useContext } from 'react';
import { Animated, View } from 'react-native';
import { GraphScreen, AppScreen, LeaderboardScreen, StreakScreen } from './loggedIn';
import { LoginScreen, OnboardingScreen, SignupScreen, StartScreen } from './loggedOut';
import React from 'react';


SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

const slideCardStyleInterpolator = ({
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
    const firebase = useFirebase();
    const theme = useContext(ThemeContext);

    const [fontsLoaded] = useFonts({
        LilitaOne_400Regular,
        FredokaOne_400Regular
        // 'FredokaOne-Regular': require('../src/assets/fonts/FredokaOne-Regular.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded && !firebase.initializing) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, firebase.initializing]);

    if (!fontsLoaded || firebase.initializing) return;

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer theme={{
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    background: theme.runwayBackgroundColor,
                }
            }}>
                <Stack.Navigator
                    initialRouteName={firebase.userData ? 'loggedIn' : 'start'}
                    screenOptions={{
                        cardStyleInterpolator: ({ current }) => ({
                            cardStyle: {
                                opacity: current.progress,
                            },
                        })
                    }}
                >
                    {firebase.userData ?
                        (
                            <>
                                <Stack.Screen name="loggedIn" component={LoggedInScreens} options={{ headerShown: false }} />
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
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

function LoggedInScreens({ navigation }: { navigation: any }) {
    // const firebase = useFirebase();

    return (
        <Stack.Navigator
            initialRouteName="graph"
            screenOptions={{
                cardStyleInterpolator: slideCardStyleInterpolator
            }}
        >
            <Stack.Screen name="graph" component={GraphScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="app" component={AppScreen} options={{ headerShown: false }} /> */}
            {/* <Stack.Screen name="streak" component={StreakScreen} options={{ headerShown: false }} /> */}
            {/* <Stack.Screen name="leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    )
}