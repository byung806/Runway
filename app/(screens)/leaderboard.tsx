import { MainButton } from "@/components/screens";
import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";

const tableData = [
    {"name": "jacob", "score": 100000, "place": 1},
    {"name": "bryan", "score": 99999, "place": 2},
    {"name": "random", "score": 10, "place": 3},
    {"name": "random2", "score": 9, "place": 4},
    {"name": "random3", "score": 8, "place": 5}
];

const renderItem=() => (
    <View style={styles.row}>
        <Text style={styles.cell}>(item.name)</Text>
        <Text style={styles.cell}>(item.score)</Text>
        <Text style={styles.cell}>(item.place)</Text>
    </View>
);
export default function LeaderboardScreen() {
    return (
        <View style = {styles.container}>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>Leaderboard</Text>
            </View>
            <View style={styles.header}>
                <Text style={styles.heading}>Name</Text>
                <Text style={styles.heading}>Score</Text>
                <Text style={styles.heading}>Place</Text>
            </View>
            <FlatList
                data={tableData}
                keyExtractor={(item) => (item.name.toString())}
                renderItem={renderItem}
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