import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OnboardingScreen from './onboarding';
import { usePushNotifications } from '@/utils/usePushNotifications';
import Layout from './(screens)/_layout';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function RootLayout() {
    const { expoPushToken, notification } = usePushNotifications()
    const data = JSON.stringify(notification, undefined, 2)
    {/* <Text style={styles.title}>Token: {expoPushToken?.data ?? ""}</Text>
    <Text style={styles.subtitle}>{data}</Text> */}

    return (
        <Stack.Navigator>
            <Stack.Screen name="onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="app" component={Layout} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}