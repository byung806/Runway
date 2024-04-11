import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MainButton } from '@/components';
import { SafeAreaView } from "react-native-safe-area-context";
import { usePushNotifications } from "@/utils/usePushNotifications";

export default function Page() {
    const {expoPushToken, notification} = usePushNotifications()

    const data = JSON.stringify(notification, undefined, 2)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>Token: {expoPushToken?.data ?? ""}</Text>
                <Text style={styles.subtitle}>{data}</Text>
                <MainButton
                    disabled={false}  // {selection === ''}
                    label={'COMPLETE'}
                    callback={ () => {} }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
    },
    main: {
        flex: 1,
        justifyContent: "center",
        maxWidth: 960,
        marginHorizontal: "auto",
        marginTop: 24,
    },
    title: {
        fontSize: 64,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 36,
        color: "#38434D",
    },
});
