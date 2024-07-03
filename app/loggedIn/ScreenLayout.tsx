import Book from '@/assets/svg/book.svg';
import Home from '@/assets/svg/home.svg';
import Trophy from '@/assets/svg/trophy.svg';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Styles } from '@/styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext, useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, ThemeContext } from '~/2d';
import ContentScreen from './ContentScreen';
import HomeScreen from './HomeScreen';
import LeaderboardScreen from './LeaderboardScreen';

const Tab = createMaterialTopTabNavigator();

function AnimatedIcon({ focused, route, width, height }: { focused: boolean, route: any, width: number, height: number }) {
    const theme = useContext(ThemeContext);

    const scale = useSharedValue<number>(1);
    const opacity = useSharedValue<number>(0);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedOpacity = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                opacity.value,
                [0, 1],
                ['transparent', theme.accent]
            ),
        };
    });

    useEffect(() => {
        if (focused) {
            console.log('focused');
            opacity.value = withTiming(1);
            scale.value = withTiming(1.5);
            // scale.value = withSequence(withTiming(1.2), withTiming(1));
        } else {
            console.log('not focused');
            opacity.value = withTiming(0);
            scale.value = withTiming(1);
        }
    }, [focused]);

    return (
        // <Animated.View style={animatedScale}>
            <Animated.View style={[{
                width: width + 20,
                height: height + 20,
                borderRadius: 20,
                elevation: 1,
                ...Styles.centeringContainer,
            }, animatedOpacity]}>
                {route.name === 'content' && <Book width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
                {route.name === 'home' && <Home width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
                {route.name === 'leaderboard' && <Trophy width={width} height={height} fill={focused ? theme.textInverse : theme.text} />}
            </Animated.View>
        // </Animated.View>
    )
}

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