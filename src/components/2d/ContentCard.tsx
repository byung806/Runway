import React, { useContext } from 'react';
import { View } from 'react-native';
import Text from './Text';

import { Styles } from '@/styles';
import firestore from '@react-native-firebase/firestore';
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';

import Loading from './Loading';
import { ThemeContext } from './ThemeProvider';

export default function ContentCard({ date }: { date: string }) {
    const theme = useContext(ThemeContext);

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
            <View style={{ ...Styles.flex, ...Styles.centeringContainer }}>
                <Text style={{ color: theme.text, ...Styles.subtitle }}>
                    No content for this day!
                </Text>
            </View>
        )
    }
    return (
        <View style={{ ...Styles.flex, ...Styles.centeringContainer }}>
            <Text style={{ color: theme.text, ...Styles.subtitle }}>
                {snapshot?.body}
            </Text>
            <Text style={{ color: theme.text, ...Styles.subtitle }}>
                {snapshot?.category}
            </Text>
        </View>
    )
}