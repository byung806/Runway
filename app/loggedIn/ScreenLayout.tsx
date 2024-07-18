
import { CardStyleInterpolators, createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Platform } from 'react-native';
import ContentScreen from './ContentScreen';
import StreakScreen from './StreakScreen';
import LeaderboardScreen from './LeaderboardScreen';

const Stack = createStackNavigator();

export default function ScreenLayout({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyleInterpolator: Platform.OS === 'ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forRevealFromBottomAndroid,
            }}
        >
            <Stack.Screen name="app" component={ContentScreen} options={{ headerShown: false }} />
            <Stack.Screen name="streak" component={StreakScreen} options={{ headerShown: false }} />
            <Stack.Screen name="leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
