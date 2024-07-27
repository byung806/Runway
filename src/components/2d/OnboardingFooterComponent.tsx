import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Button from "./Button";
import Text from "./Text";
import TextInput from "./TextInput";
import { useState } from "react";

export default function OnboardingFooterComponent({ height }: { height: number }) {
    const navigation = useNavigation<any>();
    return (
        <View style={{
            height,
            justifyContent: 'space-between',
        }}>
            <View style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30 }}>So what are you waiting for? Let's get started!</Text>
            </View>
            <View style={{ marginBottom: 200 }}>
                <Button title="Take off!" onPress={() => navigation.navigate('signup')} />
            </View>
        </View>
    );
}