import { ThemeContext } from "@/providers";
import { Styles } from "@/styles";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { KeyboardAvoidingView, LayoutAnimation, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./Text";
import TextInput from "./TextInput";
import { BackArrow } from "./Arrow";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function OnboardingHeaderComponent({ height, username, setUsername, arrowDown }: { height: number, username: string, setUsername: Dispatch<SetStateAction<string>>, arrowDown: JSX.Element }) {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation<any>();
    const focused = useIsFocused();

    useEffect(() => {
        if (focused) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        }
    }, [focused]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }, [username]);

    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View style={{
                position: 'absolute',
                top: 60,
                left: 20,
                zIndex: 1,
            }}>
                <BackArrow color={theme.runwayTextColor} onPress={() => { navigation.navigate('start') }} />
            </View>
            <KeyboardAvoidingView style={{
                flex: 1,
                ...Styles.centeringContainer,
                paddingHorizontal: 60,
                gap: 20,
            }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <FontAwesome5 name="user-alt" size={36} color={theme.runwayTextColor} />
                <Text style={{ fontSize: 30, textAlign: 'center', color: theme.runwayTextColor }}>What should we call you?</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    maxLength={16}
                    placeholder={'Username'}
                    style={{ fontSize: 20, textAlign: 'center', height: 50, width: '80%' }}
                />
                <Text style={{ fontSize: 18, textAlign: 'center', color: theme.runwaySubTextColor }}>This will be public to everyone!</Text>
                {/* TODO: check username availability */}
                {username.length > 0 && username.length < 3 &&
                    <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.runwayTextColor }}>At least 3 characters please!</Text>
                }
            </KeyboardAvoidingView>
            {arrowDown ?
                <SafeAreaView style={{ position: 'absolute', width: '100%', bottom: 0, ...Styles.centeringContainer, padding: 20, gap: 10 }} edges={['bottom']}>
                    {arrowDown}
                </SafeAreaView>
                : null
            }
        </View>
    );
}