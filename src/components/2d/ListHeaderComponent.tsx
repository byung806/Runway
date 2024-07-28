import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";
import { ThemeContext } from "./ThemeProvider";


export default function ListHeaderComponent({ height, arrowDown }: { height: number, arrowDown: JSX.Element }) {
    const firebase = useFirebase();
    const navigation = useNavigation<any>();
    const theme = useContext(ThemeContext);

    async function checkUncompletedChallengeToday() {
        const uncompletedChallengeToday = await firebase.checkUncompletedChallengeToday();
        console.log('uncompletedChallengeToday', uncompletedChallengeToday);
        if (uncompletedChallengeToday) {
            navigation.navigate('content');
        }
    }

    async function addFriend(username: string) {
        const { success } = await firebase.addFriend(username);
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
                gap: 10,
            }}>
                <Button title="Log Out" onPress={logOut} style={{ width: '80%' }} />
                <Button title="Leaderboard" onPress={() => navigation.navigate('leaderboard')} style={{ width: '80%' }} />
            </View>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.username}</Text>
                <Text style={{ fontSize: 100, ...Styles.lightShadow, color: theme.runwayTextColor }}>{firebase.userData?.points}</Text>
            </View>
            <View style={{ ...Styles.centeringContainer }}>
                {arrowDown}
            </View>
        </View>
    );
}