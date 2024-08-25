import { ThemeContext } from "@/providers";
import { Styles } from "@/styles";
import { Dispatch, SetStateAction, useContext } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./Text";
import TextInput from "./TextInput";
import { BackArrow } from "./Arrow";
import { useNavigation } from "@react-navigation/native";

export default function OnboardingHeaderComponent({ height, username, setUsername, arrowDown }: { height: number, username: string, setUsername: Dispatch<SetStateAction<string>>, arrowDown: JSX.Element }) {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation<any>();

    return (
        <View style={{
            height,
            justifyContent: 'space-between'
        }}>
            <View style={{
                position: 'absolute',
                top: 60,
                left: 0,
                zIndex: 1,
            }}>
                <BackArrow color={theme.white} onPress={() => { navigation.navigate('start') }} />
            </View>
            <KeyboardAvoidingView style={{
                flex: 1,
                ...Styles.centeringContainer,
            }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30, color: theme.white }}>What should we call you?</Text>
                <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 30, color: theme.gray }}>This will be public to everyone!</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    maxLength={16}
                    placeholder={'Username'}
                    style={{ fontSize: 20, textAlign: 'center', marginBottom: 30, height: 50, width: '80%' }}
                />
                {/* TODO: check username availability */}
                {username.length > 0 && username.length < 3 &&
                    <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.white }}>At least 3 characters please!</Text>
                }
            </KeyboardAvoidingView>
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