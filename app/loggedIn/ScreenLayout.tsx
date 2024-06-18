import Book from '@/assets/svg/book.svg';
import Home from '@/assets/svg/home.svg';
import Trophy from '@/assets/svg/trophy.svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';

import ContentScreen from './ContentScreen';
import HomeScreen from './HomeScreen';
import LeaderboardScreen from './LeaderboardScreen';

const Tab = createBottomTabNavigator();

export default function ScreenLayout() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'Content') {
                        return <Book width={30} height={30} fill={focused ? colors.primary : colors.text} />;
                    } else if (route.name === 'Home') {
                        return <Home width={30} height={30} fill={focused ? colors.primary : colors.text} />;
                    } else if (route.name === 'Leaderboard') {
                        return <Trophy width={30} height={30} fill={focused ? colors.primary : colors.text} />;
                    }
                },
            })}
        >
            <Tab.Screen name="Content" component={ContentScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}