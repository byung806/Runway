import LeaderboardEntry from "@/components/screens/LeaderboardEntry";
import Text from '~/Text';
import { Styles } from "@/styles";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TableItemType {
    name: string;
    score: number;
}

const tableData = [
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

const renderItem = (item: TableItemType, place: number) => {
    var color;
    if (place == 1) {
        color = "gold";
    } else if (place == 2) {
        color = "silver";
    } else if (place == 3) {
        color = "#CD7F32";
    }
    return (
        <LeaderboardEntry
            place={place}
            avatar={"@/assets/favicon.png"}
            name={item.name}
            score={item.score}
            color={color}
        />
    );
}

export default function LeaderboardScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }} edges={['top']}>
            <View 
                style={{
                    ...Styles.titleBox,
                    ...Styles.centeringContainer,
                    flexShrink: 1,
                }}>
                <Text style={{ ...Styles.title, color: colors.card }}>Leaderboard</Text>
            </View>
            
            <View 
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    flexGrow: 1,
                }}>
                <FlatList
                    data={tableData.sort((a, b) => b.score - a.score)}
                    keyExtractor={(item) => (item.name.toString())}
                    renderItem={({ item, index }) => renderItem(item, index + 1)}
                />
            </View>
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