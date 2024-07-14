import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { ThemeProvider } from '~/2d';

import { Silkscreen_400Regular, useFonts } from '@expo-google-fonts/silkscreen';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { ScreenLayout } from './loggedIn';
import { LoginScreen, OnboardingScreen, SignupScreen, StartScreen } from './loggedOut';
import { FirebaseProvider } from '@/utils/FirebaseProvider';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

const emulator = false;
if (emulator) {
    console.log('from index.tsx:  Using Firebase Emulator');
    auth().useEmulator('http://localhost:9099');
    functions().useEmulator('localhost', 5001);
    firestore().useEmulator('localhost', 8080);
}

export default function App() {
    const [fontsLoaded] = useFonts({
        Silkscreen_400Regular,
    });

    // const { expoPushToken, notification } = usePushNotifications()
    // const data = JSON.stringify(notification, undefined, 2)
    // token: expoPushToken?.data ?? ""
    // TODO: daily push notifications

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        // console.log('from index.tsx:  useEffect');
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

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <FirebaseProvider>
                <ThemeProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName={user ? 'logged_in_app' : 'start'}
                            screenOptions={{
                                cardStyleInterpolator: Platform.OS === 'ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forRevealFromBottomAndroid,
                            }}
                        >
                            <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="logged_in_app" component={ScreenLayout} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ThemeProvider>
            </FirebaseProvider>
        </View>
    );
}

registerRootComponent(App);
