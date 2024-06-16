import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading, Text } from '~/2d';
import { MainScene } from '~/3d';

import { Styles } from '@/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';

export default function HomeScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any }) {
    const { colors } = useTheme();
    const user = auth().currentUser;  // guaranteed to be signed in
    const [snapshot, loading, error] = useDocumentDataOnce(
        firestore().collection('users').doc(user?.uid)
    );

    function logOut() {
        auth().signOut().then(() => {
            console.log('User signed out!');
            navigation.navigate('login');
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
                        color: colors.text,
                        ...Styles.subtitle,
                    }}>
                        {snapshot?.username}
                    </Text>
                </Pressable>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <MaterialCommunityIcons name="fire" size={30} color={colors.text} />
                    <Text style={{
                        color: colors.text,
                        ...Styles.subtitle,
                    }}>
                        {snapshot?.points}
                    </Text>
                </View>
            </SafeAreaView>
            <MainScene referenceSphere={true} />
        </View>
    );
};
