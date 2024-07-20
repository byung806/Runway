import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";


export default function ListHeaderComponent({ height }: { height: number }) {
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
                <Button title="Log Out" onPress={logOut} filled={false} />
                <Button title="Leaderboard" onPress={() => navigation.navigate('leaderboard')} filled={false} />
                {/* <Button title="today" onPress={requestCompleteToday} filled={false} /> */}
            </View>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40 }}>{firebase.userData?.username}</Text>
                <Text style={{ fontSize: 100 }}>{firebase.userData?.points}</Text>
            </View>
            <View style={{ ...Styles.centeringContainer }}>
                <AntDesign name="down" size={40} color={theme.text} />
            </View>
        </View>
    );
}