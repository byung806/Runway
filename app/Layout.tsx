import { useFirebase } from '@/utils/FirebaseProvider';
import { Silkscreen_400Regular, useFonts } from '@expo-google-fonts/silkscreen';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Platform, View } from 'react-native';
import { ScreenLayout } from './loggedIn';
import { LoginScreen, OnboardingScreen, SignupScreen, StartScreen } from './loggedOut';


SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function Layout() {
    // TODO: push notifications
    // const { expoPushToken, notification } = usePushNotifications()
    // const data = JSON.stringify(notification, undefined, 2)
    // token: expoPushToken?.data ?? ""
    
    const firebase = useFirebase();
    const [fontsLoaded] = useFonts({
        Silkscreen_400Regular,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded && !firebase.initializing) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, firebase.initializing]);

    if (!fontsLoaded || firebase.initializing) return;

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={firebase.userData ? 'logged_in_app' : 'start'}
                    screenOptions={{
                        cardStyleInterpolator: Platform.OS === 'ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forRevealFromBottomAndroid,
                    }}
                >
                    <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false, gestureEnabled: false }} />
                    <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="logged_in_app" component={ScreenLayout} options={{ headerShown: false, gestureEnabled: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}