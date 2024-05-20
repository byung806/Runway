import { Logo, OnboardingPage } from "@/components/screens";
import { Colors, Styles } from "@/styles";
import { View, Image, Text } from "react-native";
import ViewPager from "react-native-pager-view"
import React, { useRef } from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';


interface Slide {
    backgroundColor: string;
    image: JSX.Element;
    title: string;
    subtitle: string;
}

const slides: Slide[] = [
    {
        backgroundColor: '#fff',
        image: <Image source={require('src/assets/favicon.png')} />,
        title: 'Welcome to app',
        subtitle: 'subtitle 1',
    },
    {
        backgroundColor: '#444',
        image: <Image source={require('src/assets/favicon.png')} />,
        title: 'Hi',
        subtitle: 'subtitle 2',
    }
]

export default function OnboardingScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const pagerRef = useRef<ViewPager>(null);
    const size = 144;

    const handlePageChange = (pageNumber: number) => {
        pagerRef.current?.setPage(pageNumber);
    };

    return (
        <View style={{ flex: 1 }}>
            <ViewPager style={{ flex: 1 }} ref={pagerRef}>
                <View key="1">
                    <OnboardingPage
                        prevButtonCallback={() => { navigation.navigate('start') }}
                        nextButtonCallback={() => { handlePageChange(1) }}
                    >
                        <>
                            <MaterialIcons name="science" size={size} color={Colors.light.accent} />
                            <Text style={Styles.title}>Explore Different Science Topics</Text>
                        </>
                    </OnboardingPage>
                </View>
                <View key="2">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(0) }}
                        nextButtonCallback={() => { handlePageChange(2) }}
                    >
                        <>
                            <Ionicons name="game-controller" size={size} color={Colors.light.accent} />
                            <Text style={Styles.title}>Play Minigames</Text>
                        </>
                    </OnboardingPage>
                </View>
                <View key="3">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(1) }}
                        nextButtonCallback={() => { handlePageChange(3) }}
                    >
                        <>
                            <MaterialCommunityIcons name="fire" size={size} color={Colors.light.accent} />
                            <Text style={Styles.title}>Rack Up Points and Streaks</Text>
                        </>
                    </OnboardingPage>
                </View>
                <View key="4">
                    <OnboardingPage
                        buttonText="TAKE OFF!"
                        prevButtonCallback={() => { handlePageChange(2) }}
                        nextButtonCallback={() => { navigation.navigate("app") }}
                    >
                        <>
                            <FontAwesome5 name="user-friends" size={size} color={Colors.light.accent} />
                            <Text style={Styles.title}>Compete with Friends</Text>
                        </>
                    </OnboardingPage>
                </View>
            </ViewPager >
        </View >
    );
}
