import { useFirebase } from '@/utils/FirebaseProvider';
import { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import LeaderboardEntry from './LeaderboardEntry';
import Loading from './Loading';
import { ThemeContext } from './ThemeProvider';
import Text from './Text';
import Button from './Button';
import TextInput from './TextInput';

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