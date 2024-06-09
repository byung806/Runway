import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from "react";
import { Pressable, Text, View } from "react-native";

import MainScene from "@/components/game/scenes/MainScene";
import { MainButton } from '@/components/screens';
import Header from "@/components/screens/Header";
import Loading from '@/components/screens/Loading';
import { Styles } from "@/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import { useTheme } from "@react-navigation/native";
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';
import { SafeAreaView } from "react-native-safe-area-context";


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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <Header>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {/* TODO: profile & logout */}
                    <Pressable onPress={logOut}>
                        <Text style={{
                            color: colors.primary,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>
                            {snapshot?.username}
                        </Text>
                    </Pressable>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                        <MaterialCommunityIcons name="fire" size={30} color={colors.primary} />
                        <Text style={{
                            color: colors.primary,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>
                            {snapshot?.points}
                        </Text>
                    </View>
                </View>
            </Header>
            <View style={Styles.flex} {...props}>
                <MainScene referenceSphere={true} />
            </View>
        </SafeAreaView>
    );
};
