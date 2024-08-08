import { ThemeContext } from "@/providers";
import { Styles } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";

export default function OnboardingFooterComponent({ height, username }: { height: number, username: string }) {
    const navigation = useNavigation<any>();
    const theme = useContext(ThemeContext);

    return (
        <View style={{
            height,
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30, color: theme.white }}>Create an account to save your points!</Text>
                <Button
                    title="Create Account"
                    onPress={() => navigation.navigate('signup', { initialUsername: username })}
                    style={{ width: '80%', height: 50, marginBottom: 100 }}
                />
            </View>
        </View>
    );
}