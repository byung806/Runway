import { ThemeContext, useFirebase } from "@/providers";
import { Styles } from "@/styles";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
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
    const firebase = useFirebase();
    const focused = useIsFocused();

    const [loading, setLoading] = useState<boolean>(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);

    async function checkUsername(username: string) {
        console.log('checking username', username);
        setLoading(true);
        const good = await firebase.isUsernameAvailable(username);
        console.log(username, 'available?', good);
        setLoading(false);
        setUsernameAvailable(good);
    }

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
            }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{
                    width: '100%',
                    ...Styles.centeringContainer,
                    gap: 20,
                }}>
                    <FontAwesome5 name="user-alt" size={36} color={theme.runwayTextColor} />
                    <Text style={{ fontSize: 30, textAlign: 'center', color: theme.runwayTextColor }}>What should we call you?</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <TextInput
                            value={username}
                            onChangeText={(text: string) => {
                                if (text.length >= 3 && text.length <= 15) {
                                    setUsernameAvailable(false);
                                    checkUsername(text);
                                }
                                setUsername(text);
                            }}
                            maxLength={16}
                            placeholder={'Username'}
                            style={{ fontSize: 20, textAlign: 'center', height: 50, width: '80%' }}
                        />
                        {username.length >= 3 && username.length <= 15 && usernameAvailable ?
                            <FontAwesome5 name="check" size={24} color={theme.questionCorrectColor} />
                            : null}
                    </View>
                    {!usernameAvailable && !loading && username.length >= 3 && username.length <= 15 &&
                        <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.runwayTextColor }}>This username is taken!</Text>
                    }
                    {username.length > 0 && username.length < 3 &&
                        <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.runwayTextColor }}>At least 3 characters please!</Text>
                    }
                    <Text style={{ fontSize: 18, textAlign: 'center', color: theme.runwaySubTextColor }}>This will be public to everyone!</Text>
                </View>
            </KeyboardAvoidingView>
            {arrowDown && usernameAvailable ?
                <SafeAreaView style={{ position: 'absolute', width: '100%', bottom: 0, ...Styles.centeringContainer, padding: 20, gap: 10 }} edges={['bottom']}>
                    {arrowDown}
                </SafeAreaView>
                : null
            }
        </View>
    );
}