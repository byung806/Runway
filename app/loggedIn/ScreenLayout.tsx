import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useFirebase } from '@/utils/FirebaseProvider';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, ThemeContext } from '~/2d';
import ContentScreen from './ContentScreen';
import HomeScreen from './HomeScreen';
import LeaderboardScreen from './LeaderboardScreen';

const Tab = createMaterialTopTabNavigator();

export default function ScreenLayout({ navigation }: { navigation: StackNavigationProp<any, any> }) {
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