import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { CardStyleInterpolators, createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useContext } from 'react';
import { Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, ThemeContext } from '~/2d';
import ContentScreen from './ContentScreen';
import HomeScreen from './HomeScreen';
import LeaderboardScreen from './LeaderboardScreen';
import StreakScreen from './StreakScreen';

const Stack = createStackNavigator();

export default function ScreenLayout({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyleInterpolator: Platform.OS === 'ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forRevealFromBottomAndroid,
            }}
        >
            <Stack.Screen name="app" component={App} options={{ headerShown: false }} />
            <Stack.Screen name="streak" component={StreakScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

const Tab = createMaterialTopTabNavigator();

function App({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['bottom']}>
            <Tab.Navigator
                initialRouteName="home"
                tabBar={props => <TabBar {...props} />}
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