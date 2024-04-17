import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, LeaderboardScreen } from ".";

const Tab = createBottomTabNavigator();

export default function ScreenLayout() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}