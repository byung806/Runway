import React, { useContext } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading, Text, ThemeContext } from '~/2d';
import { MainScene } from '~/3d';

import { Styles } from '@/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';

export default function HomeScreen({ navigation, props }: { navigation: StackNavigationProp<any, any>, props?: any }) {
    const theme = useContext(ThemeContext);

    const user = auth().currentUser;  // guaranteed to be signed in
    const [snapshot, loading, error] = useDocumentDataOnce(
        firestore().collection('users').doc(user?.uid)
    );

    function logOut() {
        auth().signOut().then(() => {
            console.log('User signed out!');
        });
    }

    if (loading) {
        return <Loading />;
    }
    if (error) {
        alert(error);
    }
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{
                flex: 1,
                position: 'absolute',
                zIndex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                margin: 20
            }} edges={['top']}>
                <Pressable onPress={logOut}>
                    <Text style={{
                        color: theme.text,
                        ...Styles.subtitle,
                    }}>
                        {snapshot?.username}
                    </Text>
                </Pressable>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <MaterialCommunityIcons name="fire" size={30} color={theme.text} />
                    <Text style={{
                        color: theme.text,
                        ...Styles.subtitle,
                    }}>
                        {snapshot?.points}
                    </Text>
                </View>
            </SafeAreaView>
            <MainScene />
        </View>
    );
};
