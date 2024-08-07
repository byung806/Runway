import { ThemeContext, useFirebase } from "@/providers";
import { Styles } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View } from "react-native";
import AddFriendModal from "./AddFriendModal";
import Button from "./Button";
import Text from "./Text";


export default function ListHeaderComponent({ height, arrowDown }: { height: number, arrowDown: JSX.Element }) {
    const firebase = useFirebase();
    const navigation = useNavigation<any>();
    const theme = useContext(ThemeContext);

    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    async function logOut() {
        await firebase.logOut();
    }

    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Button title="Add Friend" onPress={() => { setAddFriendModalVisible(true); }} />
                <Button title="Log Out" onPress={logOut} backgroundColor='transparent' />
            </View>

            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', color: theme.white }}>
                    {/* Welcome back, */}
                    <Text style={{ color: theme.runwayTextColor }}> {firebase.userData?.username}</Text>
                    {/* ! */}
                </Text>
                <Text style={{ fontSize: 100, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.points}</Text>
                <Text style={{ fontSize: 30, ...Styles.lightShadow, color: theme.runwayTextColor }}>points</Text>
                <Button title="Leaderboard" onPress={() => navigation.navigate('leaderboard')} style={{ width: '80%', marginTop: 20 }} />
            </View>

            {!firebase.todayCompleted && (
                <View style={{ ...Styles.centeringContainer, gap: 10 }}>
                    <Text style={{ fontSize: 30, ...Styles.lightShadow, color: theme.runwayTextColor, textAlign: 'center' }}>
                        {/* {firebase.userData?.username} */}
                        <Text style={{ color: theme.white }}>New challenge available!</Text>
                    </Text>
                    {arrowDown}
                </View>
            )}

            <AddFriendModal
                visible={addFriendModalVisible}
                setVisible={setAddFriendModalVisible}
            />
        </View>
    );
}