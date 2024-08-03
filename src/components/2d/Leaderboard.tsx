import { Styles } from '@/styles';
import { LeaderboardType, useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { useContext, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Button from './Button';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';
import AddFriendModal from './AddFriendModal';

interface LeaderboardEntryProps {
    place: number;
    avatar: string;
    name: string;
    points: number;
    streak: number;
    color?: any;
}

const AnimatedView = animated(View);

function LeaderboardEntry({ place, avatar, name, points, streak }: LeaderboardEntryProps) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.95,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle
    });

    // TODO: animate leaderboardentry

    function colorFromPlace(place: number): string {
        if (place == 1) {
            return "gold";
        } else if (place == 2) {
            return "silver";
        } else if (place == 3) {
            return "#CD7F32";
        }
        return "#ffffff";
    }

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <AnimatedView style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: firebase.userData?.username === name ? theme.runwayBackgroundColor : theme.runwayBackgroundColor,
                borderColor: firebase.userData?.username === name ? theme.runwayTextColor : 'transparent',
                borderWidth: 4,
                borderRadius: 10,
                transform: [{ scale: scale }],
            }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: theme.runwayTextColor, fontSize: 15, marginLeft: 10, marginRight: 30 }}>{place}</Text>
                    {/* <Image source={{ uri }} style={{ width: 50, height: 50 }} /> */}
                    <Text style={{ color: theme.runwayTextColor, fontSize: 15, }}>{name}</Text>
                </View>
                <View style={{
                    margin: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 9999,
                    // width: 60,
                    backgroundColor: theme.accent,
                    ...Styles.centeringContainer,
                }}>
                    <Text style={{
                        color: colorFromPlace(place),
                    }}>{points}</Text>
                </View>
            </AnimatedView>
        </Pressable>
    );
}

export default function Leaderboard({ type }: { type: LeaderboardType }) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    const data = type === 'friends' ? firebase.friendsLeaderboard : firebase.globalLeaderboard;

    if (type === 'friends' && data?.leaderboard.length === 0) {
        // show ui if user has no friends
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.runwayBackgroundColor,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text style={{ color: theme.runwayTextColor, fontSize: 20, marginBottom: 20 }}>You have no friends yet!</Text>
                    <Button title='Add Friend' onPress={() => { setAddFriendModalVisible(true) }} />
                </View>

                <AddFriendModal
                    visible={addFriendModalVisible}
                    setVisible={setAddFriendModalVisible}
                />
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.runwayBackgroundColor,
            }}>
            <FlatList
                data={data?.leaderboard}
                style={{
                    padding: 10,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyExtractor={(item) => (item.username)}
                renderItem={({ item, index }) => <LeaderboardEntry
                    place={index + 1}
                    avatar={''}
                    name={item.username}
                    points={item.points}
                    streak={item.streak}
                />}
            />
        </View>
    );
}