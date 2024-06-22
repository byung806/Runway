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
import { StackNavigationProp } from '@react-navigation/stack';

const Tab = createMaterialTopTabNavigator();

export default function ScreenLayout({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <Tab.Navigator
                initialRouteName="home"
                screenOptions={({ route }) => ({
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => {
                        if (route.name === 'content') {
                            return <Book width={30} height={30} fill={focused ? colors.primary : colors.text} />;
                        } else if (route.name === 'home') {
                            return <Home width={30} height={30} fill={focused ? colors.primary : colors.text} />;
                        } else if (route.name === 'leaderboard') {
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
                <Tab.Screen name="content" component={ContentScreen} />
                <Tab.Screen name="home" component={HomeScreen} />
                <Tab.Screen name="leaderboard" component={LeaderboardScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}