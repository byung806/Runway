import { Styles } from '@/styles';
import { useFirebase } from '@/utils/FirebaseProvider';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Button from './Button';
import Loading from './Loading';
import Text from './Text';
import TextInput from './TextInput';
import { ThemeContext } from './ThemeProvider';

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
        return theme.text;
    }

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <AnimatedView style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: theme.backgroundSecondary,
                borderRadius: 10,
                transform: [{ scale: scale }],
            }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: theme.text, ...Styles.bodyText, ...Styles.heavy, marginLeft: 10, marginRight: 30 }}>{place}</Text>
                    {/* <Image source={{ uri }} style={{ width: 50, height: 50 }} /> */}
                    <Text style={{ color: theme.text, ...Styles.bodyText }}>{name}</Text>
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

interface LeaderboardType {
    type: 'friends' | 'global';
}

interface LeaderboardUser {
    username: string;
    points: number;
    streak: number;
}

export default function Leaderboard({ type }: LeaderboardType) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const [leaderboardData, setLeaderboardData] = useState<{ leaderboard: LeaderboardUser[]; rank: number; } | null>(null);

    const [friend, setFriend] = useState('');

    // on mount get leaderboard data
    useEffect(() => {
        if (!firebase.user) {
            setLeaderboardData({ leaderboard: [], rank: 0 });
            return;
        }
        getLeaderboardData();
    }, [firebase.user]);

    async function getLeaderboardData() {
        const data = await firebase.getLeaderboard(type);
        setLeaderboardData(data);
    }

    if (!leaderboardData) {
        return <Loading />;
    }
    if (type === 'friends' && leaderboardData.leaderboard.length === 0) {
        // show ui if user has no friends
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text style={{ color: theme.text, fontSize: 20 }}>You have no friends yet!</Text>
                    <TextInput
                        placeholder={'Friend Username'}
                        onChangeText={setFriend}
                        style={{ marginBottom: 10 }}
                    />
                    <Button title='Add Friend' onPress={async () => {
                        const success = await firebase.addFriend(friend);
                        if (success) {
                            setFriend('');
                            getLeaderboardData();
                        }
                    }} />
                </View>
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.background,
            }}>
            <FlatList
                data={leaderboardData.leaderboard}
                style={{
                    padding: 10,
                }}
                ItemSeparatorComponent={() => <View style={{height: 10}} />}
                keyExtractor={(item) => (item.username)}
                renderItem={({ item, index }) => <LeaderboardEntry
                    place={index + 1}
                    avatar={"@/assets/favicon.png"}
                    name={item.username}
                    points={item.points}
                    streak={item.streak}
                />}
            />
        </View>
    );
}