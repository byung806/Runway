import { BackArrow, Button, Text } from '@/components/2d';
import React, { useContext, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Styles } from '@/styles';

import AddFriendModal from '@/components/2d/AddFriendModal';
import Leaderboard from '@/components/2d/Leaderboard';
import { ThemeContext, useFirebase } from '@/providers';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { FontAwesome } from '@expo/vector-icons';


export default function LeaderboardScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }} edges={['top']}>
            <Tabs.Container
                renderHeader={(props) => {
                    return (
                        <>
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
                                <BackArrow color={theme.white} onPress={() => { navigation.navigate('app') }} />
                                {/* <Text style={{ color: theme.white, fontSize: 20, ...Styles.shadow }}>Back</Text> */}
                                <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); firebase.logOut(); }}>
                                    <MaterialIcons name="exit-to-app" size={30} color={theme.white} />
                                </Pressable>
                                {/* <Button title="Log Out" onPress={() => { firebase.logOut(); }} backgroundColor='transparent' /> */}
                            </View>

                            {/* Profile */}
                            <View style={{
                                pointerEvents: 'box-none',
                                gap: 20,
                                marginBottom: 20,
                            }}>
                                <View style={{
                                    pointerEvents: 'none',

                                    alignSelf: 'center',
                                    ...Styles.centeringContainer,
                                }}>
                                    <FontAwesome name={'trophy'} size={160} color={theme.trophyYellow} />
                                </View>

                                <View style={{
                                    flex: 1,
                                    ...Styles.centeringContainer,
                                    pointerEvents: 'box-none',
                                    gap: 10,
                                }}>
                                    <View style={{ pointerEvents: 'none', ...Styles.centeringContainer, }}>
                                        <Text style={{ fontSize: 40, textAlign: 'center', color: theme.white }}>
                                            {/* Welcome back, */}
                                            <Text style={{ color: theme.runwayTextColor }}> {firebase.userData?.username}</Text>
                                            {/* ! */}
                                        </Text>
                                        <Text style={{ fontSize: 100, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.points}</Text>
                                        <Text style={{ fontSize: 30, ...Styles.lightShadow, color: theme.runwayTextColor }}>points</Text>
                                    </View>
                                    <Button title="Add Friend" onPress={() => { setAddFriendModalVisible(true); }} style={{ width: '80%', marginTop: 20 }} />
                                </View>
                            </View>

                            {/* Add friend modal */}
                            <AddFriendModal
                                visible={addFriendModalVisible}
                                setVisible={setAddFriendModalVisible}
                            />
                        </>
                    );
                }}
                renderTabBar={(props) => {
                    return (
                        <MaterialTabBar
                            {...props}
                            activeColor={theme.runwayTextColor}
                            inactiveColor={theme.runwayBorderColor}
                            indicatorStyle={{ backgroundColor: theme.runwayTextColor }}
                            style={{ backgroundColor: theme.runwayBackgroundColor }}
                            labelStyle={{ fontSize: 16, fontFamily: 'Inter_800ExtraBold', textTransform: 'none' }}
                        />
                    )
                }}
                containerStyle={{
                    backgroundColor: theme.runwayBackgroundColor,
                }}
                headerContainerStyle={{
                    backgroundColor: theme.runwayBackgroundColor,
                }}
                allowHeaderOverscroll={true}
                lazy={false}
            >
                <Tabs.Tab name="Global">
                    <Leaderboard type='global' />
                </Tabs.Tab>
                <Tabs.Tab name="Friends">
                    <Leaderboard type='friends' />
                </Tabs.Tab>
            </Tabs.Container>
        </SafeAreaView>
    );
}