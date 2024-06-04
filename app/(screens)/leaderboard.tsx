import { MainButton } from "@/components/screens";
import { Styles } from "@/styles";
import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, ListRenderItemInfo } from "react-native";

const tableData = [
    { "name": "bryan", "score": 99999, "place": 2 },
    { "name": "jacob", "score": 100000, "place": 1 },
    { "name": "random", "score": 10, "place": 3 },
    { "name": "random2", "score": 9, "place": 4 },
    { "name": "random3", "score": 8, "place": 5 },
    { "name": "dummy1", "score": 7, "place": 6 },
    { "name": "dummy2", "score": 6, "place": 7 },
    { "name": "dummy3", "score": 5, "place": 8 },
    { "name": "dummy4", "score": 4, "place": 9 },
    { "name": "dummy5", "score": 3, "place": 10 },
    { "name": "dummy6", "score": 2, "place": 11 },
    { "name": "dummy7", "score": 1, "place": 12 },
    { "name": "dummy8", "score": 0, "place": 13 },
    { "name": "dummy9", "score": -1, "place": 14 },
    { "name": "dummy10", "score": -2, "place": 15 },
    { "name": "dummy11", "score": -3, "place": 16 },
    { "name": "dummy12", "score": -4, "place": 17 },
    { "name": "dummy13", "score": -5, "place": 18 },
    { "name": "dummy14", "score": -6, "place": 19 },
    { "name": "dummy15", "score": -7, "place": 20 },
    { "name": "dummy16", "score": -8, "place": 21 },
    { "name": "dummy17", "score": -9, "place": 22 },
    { "name": "dummy18", "score": -10, "place": 23 },
    { "name": "dummy19", "score": -11, "place": 24 },
    { "name": "dummy20", "score": -12, "place": 25 },
];

const renderItem = ({ item }: ListRenderItemInfo<{ name: string; score: number; place: number; }>) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.score}</Text>
        <Text style={styles.cell}>{item.place}</Text>
    </View>
);
export default function LeaderboardScreen() {
    return (
        <View style={{ ...Styles.flex }}>
            <View style={{...Styles.titleBox, ...Styles.centeringContainer}}>
                <Text style={Styles.title}>Leaderboard</Text>
            </View>
            <View style={styles.header}>
                <Text style={styles.heading}>Name</Text>
                <Text style={styles.heading}>Score</Text>
                <Text style={styles.heading}>Place</Text>
            </View>
            <FlatList
                data={tableData.sort((a, b) => b.score - a.score)}
                keyExtractor={(item) => (item.name.toString())}
                renderItem={(item) => renderItem(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 30,
        paddingHorizontal: 30
    },
    headerTopBar: {
        backgroundColor: 'green',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 2
    },
    headerTopBarText: {
        fontSize: 16,
        color: '#fff'
    },
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
        justifyContent: 'space-between',
        borderRadius: 3,
        borderColor: 'green',
        marginVertical: 0,
        marginHorizontal: 2,
        elevation: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    cell: {
        fontSize: 15,
        textAlign: 'left',
        flex: 1
    }
});