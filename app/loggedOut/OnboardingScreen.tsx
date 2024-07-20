import React, { useContext, useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Image, Easing } from 'react-native';
import ViewPager from 'react-native-pager-view';
import { OnboardingPage, Text, ThemeContext } from '@/components/2d';

import { Styles } from '@/styles';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import AnimatedNumbers from 'react-native-animated-numbers';
import { delay } from "@/utils/utils";

export default function OnboardingScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    //Add number increase animation for next page, new fire animation
    const pagerRef = useRef<ViewPager>(null);
    const size = 80;
    const theme = useContext(ThemeContext);
    const [username, setUsername] = useState('');
    const [points, setPoints] = useState(0);

    const handlePageChange = (pageNumber: number) => {
        pagerRef.current?.setPage(pageNumber);
    };

    async function handlePageChangePoints(pageNumber: number) {
        pagerRef.current?.setPage(pageNumber);
        await delay(500);
        setPoints(99999);
    };

    async function handlePageChangePointsReset(pageNumber: number) {
        pagerRef.current?.setPage(pageNumber);
        await delay(500);
        setPoints(0);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ViewPager style={{ flex: 1 }} ref={pagerRef}>
                <View key="1">
                    <OnboardingPage
                        prevButtonCallback={() => { navigation.navigate('start') }}
                        nextButtonCallback={() => { handlePageChange(1) }}
                    >
                        <View style={{ flex: 1, margin: 50, ...Styles.centeringContainer }}>
                        <Text style={{fontSize: 30, textAlign: 'center', marginBottom: 20}}>What should we call you?</Text>
                        <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 0, width: '90%' }}>
                        <TextInput placeholder={'Username'} onChangeText={setUsername} style={{ marginBottom: 10 }} />
                        </KeyboardAvoidingView>
                        </View>
                    </OnboardingPage>
                </View>
                <View key="2">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(0) }}
                        nextButtonCallback={() => { handlePageChange(2) }}
                    >
                        <View style={{ flex: 1, margin: 10, ...Styles.centeringContainer }}>
                            <Text style={{fontSize: 25, textAlign: 'center'}}>Your username is how you will be identified by friends...</Text>
                            <Image source = {require('@/assets/friends.png')} style = {{marginTop: -20, width: 475, height: 475}}/>
                        </View>
                    </OnboardingPage>
                </View>
                <View key="3">
                    <OnboardingPage
                        prevButtonCallback={() => { handlePageChange(1) }}
                        nextButtonCallback={() => { handlePageChangePoints(3) }}
                    >
                        <View style={{ flex: 1, margin: 10, ...Styles.centeringContainer }}>
                            <Text style={{fontSize: 25, textAlign: 'center'}}>And how you'll be recognized for awards!</Text>
                            <View style = {{padding: 40, flexDirection: 'row'}}>
                            <View style = {{flex: 1}}>
                                <Text style ={{fontSize:25, marginTop: 10, justifyContent: 'flex-start'}}>1</Text>
                                </View>
                                <View style = {{flex: 1}}>
                                <Image style = {{width: 100, height: 100, marginTop: -25, marginLeft: 0, marginRight: -30}} source = {require('@/assets/goldMedal.png')}/>
                                </View>
                                <View style = {{flex: 1}}>
                                <Text style ={{fontSize:25, marginTop: 10, justifyContent: 'flex-end', marginLeft: -25}}>{username}</Text>
                                </View>
                            </View>
                            <View style = {{padding: 40, flexDirection: 'row', marginTop: -60}}>
                            <View style = {{flex: 1}}>
                                <Text style ={{fontSize:25, marginTop: 10, justifyContent: 'flex-start', marginRight: 30}}>2</Text>
                                </View>
                                <View style = {{flex: 1}}>
                                <Image style = {{width: 100, height: 100, marginTop: -25, marginLeft: 0, marginRight: -30}} source = {require('@/assets/silverMedal.png')}/>
                                </View>
                                <View style = {{flex: 1}}>
                                <Text style ={{fontSize:25, marginTop: 10, justifyContent: 'flex-end', marginLeft: -25}}>Bryan</Text>
                                </View>
                            </View>
                            <View style = {{padding: 40, flexDirection: 'row', marginTop: -60}}>
                            <View style = {{flex: 1}}>
                                <Text style ={{fontSize:25, marginTop: 10, justifyContent: 'flex-start', marginRight: 30}}>3</Text>
                                </View>
                                <View style = {{flex: 1}}>
                                <Image style = {{width: 100, height: 100, marginTop: -25, marginLeft: 0, marginRight: -30}} source = {require('@/assets/bronzeMedal.png')}/>
                                </View>
                                <View style = {{flex: 1}}>
                                <Text style ={{fontSize:25, marginTop: 10, justifyContent: 'flex-end', marginLeft: -25}}>Bob</Text>
                                </View>
                            </View>
                            
                            
                        </View>
                    </OnboardingPage>
                </View>
                
                <View key="4">
                    <OnboardingPage
                    prevButtonCallback={() => { handlePageChangePointsReset(2) }}
                    nextButtonCallback={() => { handlePageChangePointsReset(4) }}
                    >
                        <View style={{ flex: 1, margin: 10, ...Styles.centeringContainer }}>
                            <Text style={{fontSize:25, textAlign: 'center'}}>Earn points by completing lessons and rise up the ranks!</Text>
                            <AnimatedNumbers
                        animateToNumber={points}
                        animationDuration= {1600}
                        fontStyle={{ color: theme.text, fontSize: 100, textAlign: 'center', fontFamily: 'Silkscreen_400Regular' }}
                        easing={Easing.out(Easing.cubic)}
                    />

                        </View>
                    </OnboardingPage>
                </View>
                <View key="5">
                    <OnboardingPage
                        buttonText="TAKE OFF!"
                        prevButtonCallback={() => { handlePageChangePoints(3) }}
                        nextButtonCallback={() => { navigation.navigate("signup") }}
                    >
                        <View style={{ flex: 1, margin: 10, ...Styles.centeringContainer }}>
                            <Text style={{fontSize: 50, marginBottom: 30, textAlign: 'center'}}>Get ready to take flight!</Text>
                            <Logo />
                        </View>
                    </OnboardingPage>
                </View>
            </ViewPager >
        </View >
    );
}
