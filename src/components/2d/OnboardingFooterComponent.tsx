import { useRunwayTheme } from "@/providers";
import { Styles } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";

export default function OnboardingFooterComponent({ height, username }: { height: number, username: string }) {
    const navigation = useNavigation<any>();
    const theme = useRunwayTheme();

    return (
        <View style={{
            height,
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
                paddingHorizontal: 30,
            }}>
                <Text style={{ fontSize: 30, textAlign: 'center', marginBottom: 30, color: theme.runwayTextColor }}>Create an account to save your points!</Text>
                <Button
                    title="Create Account"
                    onPress={() => navigation.navigate('signup', { initialUsername: username })}
                    style={{ width: '80%', height: 50, marginBottom: 100 }}
                />
            </View>
        </View>
    );
}