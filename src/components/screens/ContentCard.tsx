import { Styles } from "@/styles";
import firestore from '@react-native-firebase/firestore';
import { useTheme } from "@react-navigation/native";
import { useDocumentDataOnce } from "@skillnation/react-native-firebase-hooks/firestore";
import React from 'react';
import { View, Text } from 'react-native';
import Loading from "./Loading";


export default function ContentCard({ date }: { date: string }) {
    const { colors } = useTheme();
    const [snapshot, loading, error] = useDocumentDataOnce(
        firestore().collection('content').doc(date)
    );
    console.log(snapshot, loading, error);

    if (loading) {
        return <Loading />;
    }
    if (error) {
        alert(error);
    }
    if (!snapshot) {
        return (
            <View style={{...Styles.flex, ...Styles.centeringContainer}}>
                <Text style={{color: colors.text, fontSize: 20, fontWeight: 'bold'}}>
                    No content for this day!
                </Text>
            </View>
        )
    }
    return (
        <View style={{...Styles.flex, ...Styles.centeringContainer}}>
            <Text style={{color: colors.text, fontSize: 15, fontWeight: 'bold'}}>
                {snapshot?.body}
            </Text>
            <Text style={{color: colors.text, fontSize: 20, fontWeight: 'bold'}}>
                {snapshot?.category}
            </Text>
        </View>
    )
}