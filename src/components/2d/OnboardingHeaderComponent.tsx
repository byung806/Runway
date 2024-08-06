import { ThemeContext } from "@/providers";
import { Styles } from "@/styles";
import { Dispatch, SetStateAction, useContext } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./Text";
import TextInput from "./TextInput";

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
            {arrowDown ?
                <SafeAreaView style={{ position: 'absolute', width: '100%', bottom: 0, ...Styles.centeringContainer, padding: 20, gap: 10 }} edges={['bottom']}>
                    <Text style={{ color: theme.white, fontSize: 20 }}>Swipe</Text>
                    {arrowDown}
                </SafeAreaView>
                : null
            }
        </View>
    );
}