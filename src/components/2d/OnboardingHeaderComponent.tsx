import { Styles } from "@/styles";
import { View } from "react-native";
import Text from "./Text";
import TextInput from "./TextInput";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingHeaderComponent({ height, setUsername, arrowDown }: { height: number, setUsername: Function, arrowDown: JSX.Element }) {
    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30 }}>What should we call you?</Text>
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