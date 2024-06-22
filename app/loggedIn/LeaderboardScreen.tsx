import React, { useContext, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LeaderboardEntry, Text, ThemeContext } from '~/2d';

import { Styles } from '@/styles';
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';

import { TabView, TabBar } from 'react-native-tab-view';
import Leaderboard from '@/components/2d/Leaderboard';

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

    // const [snapshot, loading, error] = useDocumentDataOnce(
    //     firestore().collection('users').doc(user?.uid)
    // );

    const [index, setIndex] = React.useState(0);
    const [routes] = useState([
        { key: 'friends', title: 'Friends' },
        { key: 'global', title: 'Global' },
    ]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.accent }} edges={['top']}>
            <View
                style={{
                    ...Styles.titleBox,
                    ...Styles.centeringContainer,
                    flexShrink: 1,
                }}>
                <Text style={{ ...Styles.title, color: theme.textInverse }}>Leaderboard</Text>
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
                            indicatorStyle={{ backgroundColor: 'white' }}
                            style={{ backgroundColor: theme.accent }}
                            bounces={true}
                            pressColor={'transparent'}
                            renderLabel={({ route, focused, color }) => (
                                <Text style={{ color: theme.textInverse }}>{route.title}</Text>
                            )}
                        />
                    )
                }}
            />

            {/* <Leaderboard type='global' /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    heading: {
        flex: 1,
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 2,
        padding: 10,
    },
    cell: {
        fontSize: 15,
        textAlign: 'left',
        flex: 1
    }
});