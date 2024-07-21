import React, { useContext } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button3D, Logo, Text, ThemeContext } from '@/components/2d';

import { Styles } from '@/styles';
import { StackNavigationProp } from '@react-navigation/stack';

export default function StartScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);

    return (
        <View style={{ ...Styles.flex, backgroundColor: theme.background }}>
            <SafeAreaView style={{
                ...Styles.centeringContainer,
                ...Styles.flex
            }}>
                <View style={{ ...Styles.centeringContainer, ...Styles.flex }}>
                    <Logo />
                    <Text style={Styles.title}>Runway</Text>
                </View>
                <View style={{ width: "90%" }}>
                    <Button3D
                        title={'GET STARTED'}
                        onPress={() => {
                            navigation.navigate('onboarding');
                        }}
                        style={{ marginBottom: 10 }}
                    />
                    <Button3D
                        title={'I HAVE AN ACCOUNT'}
                        onPress={() => {
                            navigation.navigate('login');
                        }}
                        filled={false}
                        style={{ marginBottom: 10 }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};
