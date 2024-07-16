import React, { useContext, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ThemeContext } from '~/2d';

import { Styles } from '@/styles';

import Leaderboard from '@/components/2d/Leaderboard';
import { TabBar, TabView } from 'react-native-tab-view';

const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
        case 'friends':
            return <Leaderboard type='friends' />;
        case 'global':
            return <Leaderboard type='global' />;
        default:
            return null;
    }
};


export default function LeaderboardScreen() {
    const theme = useContext(ThemeContext);

    const [index, setIndex] = React.useState(0);
    const [routes] = useState([
        { key: 'global', title: 'Global' },
        { key: 'friends', title: 'Friends' },
    ]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundSecondary }} edges={['top']}>
            <View
                style={{
                    ...Styles.titleBox,
                    ...Styles.centeringContainer,
                    flexShrink: 1,
                }}>
                <Text style={{ ...Styles.title, color: theme.text }}>Leaderboard</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={(props) => {
                    return (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: theme.accent }}
                            style={{ backgroundColor: theme.backgroundSecondary }}
                            bounces={true}
                            pressColor={'transparent'}
                            renderLabel={({ route, focused, color }) => (
                                <Text style={{ color: theme.text }}>{route.title}</Text>
                            )}
                        />
                    )
                }}
            />
        </SafeAreaView>
    );
}