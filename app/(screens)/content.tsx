import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, ScrollView } from "react-native";

const[isVisible, setIsVisible] = useState(false);
const contentImage = require("./assets/RandomImage.png");

export default function App() {
    return (
        <ScrollView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ScrollView style={{flex: 1, backgroundColor: "green", padding: 60}}>
                <Button title="Show Content" onPress={() => setIsVisible(!isVisible)}/>
            </ScrollView>
            {isVisible && <Text>Blah Blah Blah</Text> && <Image 
            source = {contentImage} 
            style = {{width: 300, height: 300}}/>}
        </ScrollView>
    );
}
