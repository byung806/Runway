import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OnboardingScreen from './onboarding';
import { usePushNotifications } from '@/utils/usePushNotifications';
import ScreenLayout from './(screens)/layout';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';


const Stack = createNativeStackNavigator();

const forceOnboarding = false;

export default function App() {
    const { expoPushToken, notification } = usePushNotifications()
    const data = JSON.stringify(notification, undefined, 2)
    // token: expoPushToken?.data ?? ""

    const [showOnboarding, setShowOnboarding] = useState(true);
    useEffect(() => {
        async function setData() {
            const appData = await AsyncStorage.getItem("firstTime");
            if (appData == null) {
                setShowOnboarding(true);
                AsyncStorage.setItem("firstTime", "false");
            } else {
                setShowOnboarding(false);
            }
        }
        setData();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {(showOnboarding || forceOnboarding) && (
                    <Stack.Screen name="onboarding" options={{ headerShown: false }}
                    >
                        {(props) => (
                            <OnboardingScreen {...props} setShowOnboarding={setShowOnboarding} />
                        )}
                    </Stack.Screen>
                )}
                <Stack.Screen
                    name="app"
                    component={ScreenLayout}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);
