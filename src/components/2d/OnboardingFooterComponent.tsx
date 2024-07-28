import { Styles } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";

export default function OnboardingFooterComponent({ height, username }: { height: number, username: string }) {
    const navigation = useNavigation<any>();
    // TODO context: use signup context
    return (
        <View style={{
            height,
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30 }}>Let's get started!</Text>
                <Button
                    title="Sign Up"
                    // TODO!!!: fix prop not passing
                    onPress={() => navigation.navigate('signup', { initialUsername: username })}
                    style={{ width: '80%', height: 50, marginBottom: 100 }}
                />
            </View>
        </View>
    );
}