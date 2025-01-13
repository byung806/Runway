import { useFirebase, useRunwayTheme } from "@/providers";
import { Styles } from "@/styles";
import { matcher } from '@/utils/ProfanityChecker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { KeyboardAvoidingView, LayoutAnimation, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackArrow, ScrollArrow } from "./Arrow";
import Text from "./Text";
import TextInput from "./TextInput";


export default function OnboardingHeaderComponent({ focused, scrollable, setScrollable, scroll, height, username, setUsername }: { focused: boolean, scrollable: boolean, setScrollable: Function, scroll: () => void, height: number, username: string, setUsername: Dispatch<SetStateAction<string>> }) {
    const theme = useRunwayTheme();
    const navigation = useNavigation<any>();
    const firebase = useFirebase();

    const [loading, setLoading] = useState<boolean>(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);

    /**
     * Check if a username is available
     */
    async function checkUsername(username: string) {
        // console.log('checking username', username);
        if (username.length < 3) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setUsernameAvailable(false);
            setLoading(false);
            setScrollable(false);
            return;
        }
        if (username.length > 15) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setUsernameAvailable(false);
            setLoading(false);
            setScrollable(false);
            return;
        }
        if (matcher.hasMatch(username)) {
            setUsernameAvailable(false);
            setLoading(false);
            setScrollable(false);
            return
        }

        setUsernameAvailable(false);
        setLoading(true);

        const good = await firebase.isUsernameAvailable(username);
        // console.log(username, 'available?', good);

        setLoading(false);
        setUsernameAvailable(good);
        setScrollable(good);
    }

    /**
     * Animate the layout when the username changes (if check/cross or error messages appear/disappear)
     */
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
                                checkUsername(text);
                                setUsername(text);
                            }}
                            maxLength={16}
                            placeholder={'Username'}
                            style={{ fontSize: 20, textAlign: 'center', height: 50, width: '80%' }}
                        />
                        {username.length >= 3 && username.length <= 15 && usernameAvailable ?
                            <FontAwesome5 name="check" size={24} color={theme.questionCorrectColor} />
                            : null}
                        {username.length >= 3 && username.length <= 15 && !usernameAvailable && !loading ?
                            <FontAwesome5 name="times" size={24} color={theme.questionIncorrectColor} />
                            : null}
                    </View>
                    {!usernameAvailable && !loading && username.length >= 3 && username.length <= 15 && !loading &&
                        <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.questionIncorrectColor }}>Please choose a different username!</Text>
                    }
                    {username.length > 0 && username.length < 3 &&
                        <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5, color: theme.runwayTextColor }}>At least 3 characters please!</Text>
                    }
                    <Text style={{ fontSize: 18, textAlign: 'center', color: theme.runwaySubTextColor }}>This will be public to everyone!</Text>
                </View>
            </KeyboardAvoidingView>
            
            <SafeAreaView style={{ position: 'absolute', width: '100%', bottom: 0, ...Styles.centeringContainer, padding: 20, gap: 10 }} edges={['bottom']}>
                <ScrollArrow
                    type='down'
                    visible={focused && usernameAvailable}
                    onPress={scroll}
                />
            </SafeAreaView>
        </View>
    );
};
