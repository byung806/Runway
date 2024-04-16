import { Logo, OnboardingPage } from "@/components";
import { Colors, Styles } from "@/styles";
import { View, Image, Text } from "react-native";
import ViewPager from "react-native-pager-view"
import React, { useRef } from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";



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

    const handlePageChange = (pageNumber: number) => {
        pagerRef.current?.setPage(pageNumber);
    };

    return (
        <View style={{ flex: 1 }}>
            <ViewPager style={{ flex: 1 }} ref={pagerRef}>
                <View key="1">
                    <OnboardingPage
                        nextButtonCallback={() => { handlePageChange(1) }}
                    >
                        <>
                            <Logo />
                            <Text style={Styles.title}>Take off with daily puzzles</Text>
                        </>
                    </OnboardingPage>
                </View>
                <View key="2">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(0) }}
                        nextButtonCallback={() => { handlePageChange(2) }}
                    >
                        <>
                            <Logo />
                            <Text style={Styles.title}>Onboarding 2</Text>
                        </>
                    </OnboardingPage>
                </View>
                <View key="3">
                    <OnboardingPage
                        buttonText="TAKE OFF!"
                        prevButtonCallback={() => { handlePageChange(1) }}
                        nextButtonCallback={() => { navigation.navigate("app") }}
                    >
                        <>
                            <Logo />
                            <Text style={Styles.title}>Onboarding 3</Text>
                        </>
                    </OnboardingPage>
                </View>
            </ViewPager >
        </View >
    );
}
