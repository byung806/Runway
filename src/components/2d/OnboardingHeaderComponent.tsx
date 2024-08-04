import { Styles } from "@/styles";
import { Dispatch, SetStateAction, useContext } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./Text";
import TextInput from "./TextInput";
import { ThemeContext } from "./ThemeProvider";

export default function OnboardingHeaderComponent({ height, setUsername, arrowDown }: { height: number, setUsername: Dispatch<SetStateAction<string>>, arrowDown: JSX.Element }) {
    const theme = useContext(ThemeContext);

    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30, color: theme.white }}>What should we call you?</Text>
                <TextInput
                    onChangeText={setUsername}
                    placeholder={'Username'}
                    style={{ fontSize: 20, textAlign: 'center', marginBottom: 30, height: 50, width: '80%' }}
                />
            </View>
            <SafeAreaView style={{ position: 'absolute', width: '100%', bottom: 0, ...Styles.centeringContainer, padding: 20 }} edges={['bottom']}>
                {arrowDown}
            </SafeAreaView>
        </View>
    );
}