import { useTheme } from '@react-navigation/native';
import { FlatList, View } from 'react-native';
import LeaderboardEntry from './LeaderboardEntry';

interface LeaderboardType {
    type: 'friends' | 'global';
}

const DEVtableData = [
    { "name": "Bryan", "score": 10000 },
    { "name": "Jacob", "score": 8700 },
    { "name": "byung", "score": 4100 },
    { "name": "James", "score": 2400 },
    { "name": "John", "score": 450 },
    { "name": "Michael", "score": 400 },
    { "name": "William", "score": 350 },
    { "name": "David", "score": 300 },
    { "name": "Joseph", "score": 250 },
    { "name": "Daniel", "score": 200 },
    { "name": "Matthew", "score": 150 },
    { "name": "Andrew", "score": 100 },
    { "name": "Christopher", "score": 50 },
];

export default function Leaderboard({ type }: LeaderboardType) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }}>
            <FlatList
                data={DEVtableData.sort((a, b) => b.score - a.score)}
                keyExtractor={(item) => (item.name.toString())}
                renderItem={({ item, index }) => <LeaderboardEntry
                    place={index + 1}
                    avatar={"@/assets/favicon.png"}
                    name={item.name}
                    score={item.score}
                />}
            />
        </View>
    );
}