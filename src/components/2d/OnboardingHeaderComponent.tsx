import { Styles } from "@/styles";
import { useFirebase } from "@/utils/FirebaseProvider";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Button from "./Button";
import Plane from "./Plane";
import Text from "./Text";
import TextInput from "./TextInput";
import { useState } from "react";

export default function OnboardingHeaderComponent({ height, setUsername }: { height: number, setUsername: Function }) {
    const firebase = useFirebase();
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
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30 }}>What should we call you?</Text>
                <TextInput
                    onChangeText={setUsername}
                    placeholder={'Username'}
                    style={{ fontSize: 20, textAlign: 'center', marginBottom: 30, height: 50, width: '40%' }}
                />
            </View>
        </View>
    );
}