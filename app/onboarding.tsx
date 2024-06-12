import { OnboardingPage } from "@/components/screens";

import Text from '~/Text';
import { Styles } from "@/styles";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef } from 'react';
import { View } from "react-native";
import ViewPager from "react-native-pager-view";


export default function OnboardingScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const pagerRef = useRef<ViewPager>(null);
    const size = 144;
    const { colors } = useTheme(); // Add this line to use the theme

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
                            <MaterialIcons name="science" size={size} color={colors.primary} />
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
                            <Ionicons name="game-controller" size={size} color={colors.primary} />
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
                            <MaterialCommunityIcons name="fire" size={size} color={colors.primary} />
                            <Text style={Styles.title}>Rack Up Points and Streaks</Text>
                        </>
                    </OnboardingPage>
                </View>
                <View key="4">
                    <OnboardingPage
                        buttonText="TAKE OFF!"
                        prevButtonCallback={() => { handlePageChange(2) }}
                        nextButtonCallback={() => { navigation.navigate("signup") }}
                    >
                        <>
                            <FontAwesome5 name="user-friends" size={size} color={colors.primary} />
                            <Text style={Styles.title}>Compete with Friends</Text>
                        </>
                    </OnboardingPage>
                </View>
            </ViewPager >
        </View >
    );
}
