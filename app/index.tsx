import { RunwayDarkTheme, RunwayLightTheme } from '@/styles/Theme';
import { usePushNotifications } from '@/utils/usePushNotifications';
import auth from "@react-native-firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import ScreenLayout from './(screens)/layout';
import LoginScreen from './login';
import OnboardingScreen from './onboarding';
import SignupScreen from './signup';
import StartScreen from './start';


const Stack = createNativeStackNavigator();

export default function App() {
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme;

    const { expoPushToken, notification } = usePushNotifications()
    const data = JSON.stringify(notification, undefined, 2)
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
        <>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <NavigationContainer theme={theme}>
                <Stack.Navigator>
                    <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="signup" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="app" component={ScreenLayout} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

registerRootComponent(App);
