import { Button, Text } from '@/components/2d';
import React, { useContext } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Styles } from '@/styles';

import Leaderboard from '@/components/2d/Leaderboard';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { ThemeContext } from '@/providers';


export default function LeaderboardScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }} edges={['top']}>
            <Tabs.Container
                renderHeader={(props) => {
                    return (
                        <>
                            <Image
                                source={require('@/assets/unused/goldMedal.png')}
                                style={{
                                    position: 'absolute',
                                    top: -100,
                                    width: 300,
                                    height: 300,
                                    alignSelf: 'center',
                                }}
                            />
                            <View
                                style={{
                                    ...Styles.centeringContainer,
                                    height: Dimensions.get('window').height * 1 / 2,
                                    padding: 10,
                                    gap: 20,
                                }}
                                pointerEvents='box-none'
                            >
                                <Text style={{ ...Styles.title, color: theme.runwayTextColor, fontSize: 40 }}>Leaderboard</Text>
                                <Button style={{ width: '80%', height: 50 }} title="Back" onPress={() => navigation.navigate('app')} />
                            </View>
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
            >
                <Tabs.Tab name="Global">
                    <Leaderboard type='global' />
                </Tabs.Tab>
                <Tabs.Tab name="Friends">
                    <Leaderboard type='friends' />
                </Tabs.Tab>
            </Tabs.Container>
            {/* <SafeAreaView style={{ flex: 1, backgroundColor: theme.runwayBackgroundColor }} edges={['top']}>
            <FlatList
                data={[0]}
                keyExtractor={(item) => item.toString()}
                ListHeaderComponent={() =>
                    <View
                        style={{
                            ...Styles.centeringContainer,
                            padding: 10,
                            borderRadius: 5,
                            flexShrink: 1,
                            gap: 10,
                        }}>
                        <Text style={{ ...Styles.title, color: theme.runwayTextColor, fontSize: 40 }}>Leaderboard</Text>
                        <Button title="Back" onPress={() => navigation.navigate('app')} />
                    </View>
                }
                renderItem={() =>
                    <TabView
                        style={{ height: 5000 }}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: Dimensions.get('window').width }}
                        renderTabBar={(props) => {
                            return (
                                <TabBar
                                    {...props}
                                    indicatorStyle={{ backgroundColor: theme.runwayTextColor }}
                                    style={{ backgroundColor: theme.runwayBackgroundColor }}
                                    bounces={true}
                                    pressColor={'transparent'}
                                    renderLabel={({ route, focused, color }) => (
                                        <Text style={{ color: theme.runwayTextColor }}>{route.title}</Text>
                                    )}
                                />
                            )
                        }}
                    />
                }
            />
        </SafeAreaView> */}
        </SafeAreaView>
    );
}