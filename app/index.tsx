import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OnboardingScreen from './onboarding';
import { usePushNotifications } from '@/utils/usePushNotifications';
import Layout from './(screens)/_layout';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function RootLayout() {
    const { expoPushToken, notification } = usePushNotifications()
    const data = JSON.stringify(notification, undefined, 2)
    {/* <Text style={styles.title}>Token: {expoPushToken?.data ?? ""}</Text>
    <Text style={styles.subtitle}>{data}</Text> */}

    const [firstLaunch, setFirstLaunch] = useState(true);
    useEffect(() => {
        async function setData() {
            const appData = await AsyncStorage.getItem("firstTime");
            if (appData == null) {
                setFirstLaunch(true);
                AsyncStorage.setItem("firstTime", "false");
            } else {
                setFirstLaunch(false);
            }
        }
        setData();
    }, []);

    return (
        <Stack.Navigator>
            {firstLaunch && (
                <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
            )}
            <Stack.Screen name="app" component={Layout} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}