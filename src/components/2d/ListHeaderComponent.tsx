import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import Button3D from "./Button";
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

    async function requestCompleteToday() {
        const { dataChanged } = await firebase.requestCompleteToday();
        console.log('dataChanged', dataChanged);
        if (dataChanged) {
            await triggerStreakScreen();
            await firebase.getUserData();
            await firebase.getLeaderboard('global');
            // TODO: update friends leaderboard too if rank is ever implemented
        }
    }

    async function triggerStreakScreen() {
        navigation.navigate('streak');
    }

    // TODO: better log out button
    async function logOut() {
        await firebase.logOut();
    }

    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View>
                <Button3D title="Log Out" onPress={logOut} filled={false} />
                <Button3D title="Leaderboard" onPress={() => navigation.navigate('leaderboard')} filled={false} />
                <Button3D title="today" onPress={requestCompleteToday} filled={false} />
            </View>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, ...Styles.lightShadow }}>{firebase.userData?.username}</Text>
                <Text style={{ fontSize: 100, ...Styles.lightShadow }}>{firebase.userData?.points}</Text>
            </View>
            <View style={{ ...Styles.centeringContainer }}>
                {arrowDown}
            </View>
        </View>
    );
}