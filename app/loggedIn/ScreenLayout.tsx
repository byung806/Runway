import Book from '@/assets/svg/book.svg';
import Home from '@/assets/svg/home.svg';
import Trophy from '@/assets/svg/trophy.svg';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';

import ContentScreen from './ContentScreen';
import HomeScreen from './HomeScreen';
import LeaderboardScreen from './LeaderboardScreen';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

export default function ScreenLayout() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
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
                    tabBarPressColor: 'transparent',
                    tabBarBounces: true,
                    swipeEnabled: false,
                })}
                tabBarPosition="bottom"
                initialLayout={{ width: Dimensions.get('window').width }}
            >
                <Tab.Screen name="Content" component={ContentScreen} />
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}