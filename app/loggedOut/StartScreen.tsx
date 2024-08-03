import React, { useContext } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo, Text, ThemeContext } from '@/components/2d';

import { Styles } from '@/styles';
import { StackNavigationProp } from '@react-navigation/stack';

export default function StartScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);

    return (
        <View style={{
            flex: 1, backgroundColor: theme.runwayBackgroundColor,
        }}>
            <SafeAreaView style={{
                flex: 1,
                ...Styles.centeringContainer,
            }}>
                <View style={{ flex: 1, ...Styles.centeringContainer }}>
                    <Logo />
                    <Text style={{
                        fontSize: 40,
                        textAlign: 'center',
                        color: theme.black,
                    }}>Runway</Text>
                </View>
                <View style={{ width: '100%', gap: 10 }}>
                    <Button
                        title={'Get Started!'}
                        onPress={() => {
                            navigation.navigate('onboarding');
                        }}
                        style={{ width: "80%" }}
                    />
                    <Button
                        title={'I have an Account'}
                        onPress={() => {
                            navigation.navigate('login');
                        }}
                        style={{ width: "80%", padding: 10 }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
