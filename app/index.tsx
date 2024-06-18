import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';

import { RunwayDarkTheme, RunwayLightTheme } from '@/styles/Theme';
import { Silkscreen_400Regular, useFonts } from '@expo-google-fonts/silkscreen';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { ScreenLayout } from './loggedIn';
import { LoginScreen, OnboardingScreen, SignupScreen, StartScreen } from './loggedOut';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme;

    const [fontsLoaded, fontsError] = useFonts({
        Silkscreen_400Regular,
    });

    // const { expoPushToken, notification } = usePushNotifications()
    // const data = JSON.stringify(notification, undefined, 2)
    // token: expoPushToken?.data ?? ""

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;
    if (initializing) return null;

    // const [firstTime, setFirstTime] = useState(true);
    // useEffect(() => {
    //     async function setData() {
    //         const appData = await AsyncStorage.getItem("firstTime");
    //         if (appData == null) {
    //             setFirstTime(true);
    //             AsyncStorage.setItem("firstTime", "false");
    //         } else {
    //             setFirstTime(false);
    //         }
    //     }
    //     setData();
    // }, []);

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                    initialRouteName={user ? 'app' : 'start'}
                    screenOptions={{
                        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
                    }}
                >
                    {!user ?
                        <>
                            <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
                        </>
                        :
                        <>
                            <Stack.Screen name="app" component={ScreenLayout} options={{ headerShown: false }} />
                        </>
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

registerRootComponent(App);
