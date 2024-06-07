import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ContentScreen, HomeScreen, LeaderboardScreen } from ".";

import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { Colors, Styles } from "@/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function ScreenLayout() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => {
                    let iconName;

                    if (route.name === 'Content') {
                        iconName = 'book';
                    } else if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Leaderboard') {
                        iconName = 'trophy';
                    }

                    return <Icon name={iconName} size={25} color={focused ? colors.primary : colors.text} />;
                },
            })}
        >
            <Tab.Screen name="Content" component={ContentScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}