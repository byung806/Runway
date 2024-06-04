import { Styles } from "@/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, ScrollView } from "react-native";

export default function ContentScreen({ navigation, props }: { navigation: NativeStackNavigationProp<any, any>, props?: any }) {
    const[isVisible, setIsVisible] = useState(false);

    return (
        <ScrollView contentContainerStyle={Styles.centeringContainer}>
            <ScrollView style={{flex: 1, backgroundColor: "green", padding: 60}}>
                <Button title="Show Content" onPress={() => setIsVisible(!isVisible)}/>
            </ScrollView>
            {isVisible && <Text>Blah Blah Blah</Text>}
        </ScrollView>
    );
}
