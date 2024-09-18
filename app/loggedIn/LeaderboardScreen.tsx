import { AddFriendModal, BackArrow, Button, LeaderboardEntry, Text } from '@/components/2d';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, LayoutAnimation, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Styles } from '@/styles';

import { LeaderboardData, LeaderboardType, ThemeContext, useFirebase } from '@/providers';
import { FontAwesome5 } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';


export default function LeaderboardScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    const initialLeaderboardType: LeaderboardType = 'global';

    // @ts-ignore
    const [selectedIndex, setSelectedIndex] = useState(initialLeaderboardType === 'global' ? 0 : 1);

    const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>(initialLeaderboardType);
    const [data, setData] = useState<LeaderboardData | null>(
        // @ts-ignore
        initialLeaderboardType === 'friends' ? firebase.friendsLeaderboard : firebase.globalLeaderboard);

    // Update FlatList when friends leaderboard or global leaderboard updates
    useEffect(() => {
        LayoutAnimation.configureNext(
            {
                duration: 500,
                update: { type: 'spring', springDamping: 0.7 }
            }
        );
        if (leaderboardType === 'friends') {
            setData(firebase.friendsLeaderboard);
        }
        else if (leaderboardType === 'fame') {
            setData(firebase.fameLeaderboard);
        }
        else {
            setData(firebase.globalLeaderboard);
        }
    }, [firebase.friendsLeaderboard, firebase.globalLeaderboard, firebase.fameLeaderboard]);

    // Animate FlatList when switching between global and friends leaderboard
    useEffect(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        LayoutAnimation.configureNext(
            {
                duration: 500,
                update: { type: 'spring', springDamping: 0.7 }
            }
        );
        if (leaderboardType === 'friends') {
            setData(firebase.friendsLeaderboard);
        }
        else if (leaderboardType === 'fame') {
            setData(firebase.fameLeaderboard);
        }
        else {
            setData(firebase.globalLeaderboard);
        }
    }, [leaderboardType]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }}>
            <FlatList
                data={data?.leaderboard}
                contentContainerStyle={{ paddingTop: 40 }}
                ListHeaderComponent={
                    <SafeAreaView style={{ position: 'relative' }} edges={['top']}>
                        {/* Back arrow */}
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            paddingHorizontal: 20,
                            zIndex: 1,
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            // gap: 5,
                            justifyContent: 'space-between',
                        }}>
                            <BackArrow color={theme.runwayTextColor} onPress={() => { navigation.navigate('app') }} />
                        </View>

                        {/* Profile */}
                        <View style={{
                            pointerEvents: 'box-none',
                            gap: 20,
                            marginBottom: 20,
                        }}>
                            {/* Trophy */}
                            {/* <ReactSpringAnimatedView style={{
                                transform: [{ scale }],
                            }}>
                                <Pressable
                                    style={{
                                        alignSelf: 'center',
                                        ...Styles.centeringContainer,
                                    }}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                >
                                    <FontAwesome name={'trophy'} size={120} color={theme.trophyYellow} />
                                </Pressable>
                            </ReactSpringAnimatedView> */}

                            <View style={{
                                flex: 1,
                                ...Styles.centeringContainer,
                                pointerEvents: 'box-none',
                                gap: 40,
                            }}>
                                <View style={{ pointerEvents: 'none', ...Styles.centeringContainer, }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center' }}>
                                        <Text style={{ color: theme.runwaySubTextColor }}> {firebase.userData?.username} </Text>
                                        { firebase.userData && firebase.userData?.streak > 0 &&
                                        <FontAwesome5 name='fire-alt' size={30} color={'#cc5500'} style={{ ...Styles.shadow }} />}
                                    </Text>
                                    <Text style={{ fontSize: 80, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.points}</Text>
                                    <Text style={{ fontSize: 30, ...Styles.lightShadow, color: theme.runwaySubTextColor }}>points</Text>
                                </View>
                                <SegmentedControl
                                    values={['Global', 'Friends', 'Hall of Fame']}
                                    selectedIndex={selectedIndex}
                                    onChange={(event) => {
                                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                                        setLeaderboardType(event.nativeEvent.selectedSegmentIndex === 0 ? 'global' : 'friends');
                                        setLeaderboardType(event.nativeEvent.selectedSegmentIndex === 0 ? 'global' : 'fame');
                                    }}
                                    tintColor={theme.runwayButtonColor}
                                    backgroundColor={theme.runwayBackgroundColor}
                                    style={{ width: '80%', height: 40 }}
                                    fontStyle={{ color: theme.runwayButtonTextColor, fontSize: 16, fontFamily: 'LilitaOne_400Regular', fontWeight: '800' }}
                                />
                            </View>
                        </View>

                        {/* Add friend modal */}
                        <AddFriendModal
                            visible={addFriendModalVisible}
                            setVisible={setAddFriendModalVisible}
                        />
                    </SafeAreaView>
                }
                ListFooterComponent={
                    <>
                        {leaderboardType === 'friends' &&
                            <Button title="Add Friend" onPress={() => { setAddFriendModalVisible(true); }} style={{ width: '80%', marginTop: 20 }} />
                        }
                        <SafeAreaView edges={['bottom']} style={{ marginBottom: 20 }} />
                    </>
                }
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item, index }) =>
                    <LeaderboardEntry
                        place={index + 1}
                        name={item.username}
                        points={item.points}
                        streak={item.streak}
                    />
                }
                keyExtractor={(item) => (item.username)}
                style={{ padding: 10 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}