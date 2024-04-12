import { MainButton } from "@/components";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
    return (
        <View style={styles.main}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.subtitle}>Screen</Text>
            <MainButton
                disabled={false}  // {selection === ''}
                label={'GET STARTED'}
                callback={() => { }}
                filled={true}
            />
            <MainButton
                disabled={false}  // {selection === ''}
                label={'I HAVE AN ACCOUNT'}
                callback={() => { }}
                filled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24
    },
    main: {
        flex: 1,
        justifyContent: "center",
        // maxWidth: 960,
        marginHorizontal: "auto",
        // marginTop: 24,
    },
    title: {
        fontSize: 64,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 36,
        color: "#38434D",
    }
});
