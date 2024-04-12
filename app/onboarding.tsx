import { MainButton } from "@/components";
import { Colors } from "@/styles";
import { Debug } from "@/styles";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

interface Slide {
    id: number;
    require: string;
    title: string;
    subtitle: string;
}

const slides: Slide[] = [
    {
        id: 1,
        require: './assets/onboarding/1.png',
        title: 'Thing1',
        subtitle: 'Subtitle lorem ipsum'
    },
    {
        id: 2,
        require: './assets/onboarding/2.png',
        title: 'Thing2',
        subtitle: 'Subtitle lorem ipsum'
    },
    {
        id: 3,
        require: './assets/onboarding/3.png',
        title: 'Thing3',
        subtitle: 'Subtitle lorem ipsum'
    }
]

export default function OnboardingScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>Title</Text>
                <Text style={styles.subtitle}>Subtitle</Text>
            </View>
            <View style={styles.footer}>
                <MainButton
                    label={'NEXT'}
                    callback={() => { }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,

        ...Debug.border
    },
    main: {
        flex: 1,
        justifyContent: "center",
        maxWidth: 960,
        marginHorizontal: "auto",
        marginTop: 24,

        ...Debug.border
    },
    footer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        padding: 24,

        ...Debug.border
    },
    title: {
        fontSize: 64,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 36,
        color: "#38434D",
    }
});
