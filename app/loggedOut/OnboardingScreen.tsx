import React, { useRef } from 'react';
import { View } from 'react-native';
import ViewPager from 'react-native-pager-view';
import { OnboardingPage, Text } from '~/2d';

import { Styles } from '@/styles';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function OnboardingScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const pagerRef = useRef<ViewPager>(null);
    const size = 80;
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
                        <View style={{flex: 1, margin: 50, ...Styles.centeringContainer}}>
                            <MaterialIcons name="science" size={size} color={colors.primary} />
                            <Text style={Styles.title}>Explore Different Science Topics</Text>
                        </View>
                    </OnboardingPage>
                </View>
                <View key="2">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(0) }}
                        nextButtonCallback={() => { handlePageChange(2) }}
                    >
                        <View style={{flex: 1, margin: 50, ...Styles.centeringContainer}}>
                            <Ionicons name="game-controller" size={size} color={colors.primary} />
                            <Text style={Styles.title}>Play Minigames</Text>
                        </View>
                    </OnboardingPage>
                </View>
                <View key="3">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(1) }}
                        nextButtonCallback={() => { handlePageChange(3) }}
                    >
                        <View style={{flex: 1, margin: 50, ...Styles.centeringContainer}}>
                            <MaterialCommunityIcons name="fire" size={size} color={colors.primary} />
                            <Text style={Styles.title}>Rack Up Points and Streaks</Text>
                        </View>
                    </OnboardingPage>
                </View>
                <View key="4">
                    <OnboardingPage
                        buttonText="TAKE OFF!"
                        prevButtonCallback={() => { handlePageChange(2) }}
                        nextButtonCallback={() => { navigation.navigate("signup") }}
                    >
                        <View style={{flex: 1, margin: 50, ...Styles.centeringContainer}}>
                            <FontAwesome5 name="user-friends" size={size} color={colors.primary} />
                            <Text style={Styles.title}>Compete with Friends</Text>
                        </View>
                    </OnboardingPage>
                </View>
            </ViewPager >
        </View >
    );
}
