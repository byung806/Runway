import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './onboarding';
import { usePushNotifications } from '@/utils/usePushNotifications';
import ScreenLayout from './(screens)/layout';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import StartScreen from './start';
import LoginScreen from './login';
import { useColorScheme } from 'react-native';
import { RunwayDarkTheme, RunwayLightTheme } from '@/styles/Theme';


const Stack = createNativeStackNavigator();

const loggedIn = false;

export default function App() {
    const { expoPushToken, notification } = usePushNotifications()
    const data = JSON.stringify(notification, undefined, 2)
    // token: expoPushToken?.data ?? ""

    const [firstTime, setFirstTime] = useState(true);
    useEffect(() => {
        async function setData() {
            const appData = await AsyncStorage.getItem("firstTime");
            if (appData == null) {
                setFirstTime(true);
                AsyncStorage.setItem("firstTime", "false");
            } else {
                setFirstTime(false);
            }
        }
        setData();
    }, []);

    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme;

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator>
                {!loggedIn && <Stack.Screen name="start" component={StartScreen} options={{ headerShown: false }} />}
                {!loggedIn && <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />}
                {!loggedIn && <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />}
                <Stack.Screen name="app" component={ScreenLayout} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);
