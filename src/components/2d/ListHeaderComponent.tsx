import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";
import { ThemeContext } from "./ThemeProvider";
import AddFriendModal from "./AddFriendModal";


export default function ListHeaderComponent({ height, arrowDown }: { height: number, arrowDown: JSX.Element }) {
    const firebase = useFirebase();
    const navigation = useNavigation<any>();
    const theme = useContext(ThemeContext);

    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    async function checkUncompletedChallengeToday() {
        const uncompletedChallengeToday = await firebase.checkUncompletedChallengeToday();
        console.log('uncompletedChallengeToday', uncompletedChallengeToday);
        if (uncompletedChallengeToday) {
            navigation.navigate('content');
        }
    }

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
                <Text style={{ fontSize: 40, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.username}</Text>
                <Text style={{ fontSize: 100, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.points}</Text>
                <Text style={{ fontSize: 30, ...Styles.lightShadow, color: theme.runwayTextColor }}>points</Text>
                <Button title="Leaderboard" onPress={() => navigation.navigate('leaderboard')} style={{ width: '80%', marginTop: 20 }} />
            </View>
            <View style={{ ...Styles.centeringContainer }}>
                {arrowDown}
            </View>

            <AddFriendModal
                visible={addFriendModalVisible}
                setVisible={setAddFriendModalVisible}
            />
        </View>
    );
}