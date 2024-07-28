import { BaseCardAttributes, ScrollableCards, ThemeContext } from '@/components/2d';
import React, { useContext, useState } from 'react';
import { Dimensions } from 'react-native';

import OnboardingCard from '@/components/2d/OnboardingCard';
import OnboardingFooterComponent from '@/components/2d/OnboardingFooterComponent';
import OnboardingHeaderComponent from '@/components/2d/OnboardingHeaderComponent';
import { StackNavigationProp } from '@react-navigation/stack';


interface OnboardingCardAttributes extends BaseCardAttributes { }

export default function OnboardingScreen({ navigation, ...props }: { navigation: StackNavigationProp<any, any> } & any) {
    const theme = useContext(ThemeContext);
    const [username, setUsername] = useState('');

    const [cards, setCards] = useState<OnboardingCardAttributes[]>([
        {
            ref: null, colors: {
                outerBackgroundColor: "#6b44b2",
                borderColor: "#3f1d8a",
                backgroundColor: "#a58aeb",
                textColor: "#ffffff"
            }, index: 0
        }, {
            ref: null, colors: {
                outerBackgroundColor: "#8c62d0",
                borderColor: "#b3a4e0",
                backgroundColor: "#6d3b9f",
                textColor: "#ffffff"
            }, index: 1
        }, {
            ref: null, colors: {
                outerBackgroundColor: "#7453c7",
                borderColor: "#a58aeb",
                backgroundColor: "#3f1d8a",
                textColor: "#ffffff"
            }, index: 2
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#5a3494",
                borderColor: "#8e6cbf",
                backgroundColor: "#2e1463",
                textColor: "#ffffff"
            }, index: 3
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#4a2583",
                borderColor: "#6b4abf",
                backgroundColor: "#1e0d4d",
                textColor: "#ffffff"
            }, index: 4
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#3c2072",
                borderColor: "#593d9e",
                backgroundColor: "#190b3e",
                textColor: "#ffffff"
            }, index: 5
        },
        {
            ref: null, colors: {
                outerBackgroundColor: "#331a61",
                borderColor: "#4d3585",
                backgroundColor: "#14082f",
                textColor: "#ffffff"
            }, index: 6
        }
    ]);

    return (
        <ScrollableCards<OnboardingCardAttributes>
            data={cards}
            scrollable={username.length > 0}
            header={<OnboardingHeaderComponent setUsername={setUsername} height={undefined as never} arrowDown={undefined as never}/>}
            headerArrowDown={username.length > 0}
            renderItem={({ item }) =>
                <OnboardingCard
                    username={username}

                    focused={undefined as never} colors={undefined as never} style={undefined as never} index={undefined as never}
                />
            }
            footer={<OnboardingFooterComponent username={username} height={undefined as never} />}
            paddingAboveHeader={0}
            headerHeight={Dimensions.get("window").height * 1}
            padding={30}
            boxHeight={(Dimensions.get("window").width - 30 * 2) * 1.6}
            footerHeight={Dimensions.get("window").height * 0.8}
            initialBackgroundColor={theme.background}
        />
    );
}