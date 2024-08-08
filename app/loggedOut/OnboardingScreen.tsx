import { BaseCardAttributes, ScrollableCards, ScrollableCardsRef } from '@/components/2d';
import React, { useContext, useState } from 'react';
import { Dimensions } from 'react-native';

import ContentModal from '@/components/2d/ContentModal';
import OnboardingCard from '@/components/2d/OnboardingCard';
import OnboardingFooterComponent from '@/components/2d/OnboardingFooterComponent';
import OnboardingHeaderComponent from '@/components/2d/OnboardingHeaderComponent';
import { Content, ContentProvider, ThemeContext, usePushNotifications } from '@/providers';
import { StackNavigationProp } from '@react-navigation/stack';


interface OnboardingCardAttributes extends BaseCardAttributes { }

export default function OnboardingScreen({ navigation }: { navigation: StackNavigationProp<any, any> }) {
    const theme = useContext(ThemeContext);
    
    const [username, setUsername] = useState('');
    const defaultColors = {
        outerBackgroundColor: theme.runwayOuterBackgroundColor,
        borderColor: theme.runwayBorderColor,
        backgroundColor: theme.runwayBackgroundColor,
        textColor: theme.runwayTextColor
    }

    const scrollableCardsRef = React.useRef<ScrollableCardsRef<OnboardingCardAttributes>>(null);
    const [cards, setCards] = useState<OnboardingCardAttributes[]>([
        {
            ref: null, colors: {
                // outerBackgroundColor: "#6b44b2",
                // borderColor: "#3f1d8a",
                // backgroundColor: "#a58aeb",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 0
        }, {
            ref: null, colors: {
                // outerBackgroundColor: "#8c62d0",
                // borderColor: "#b3a4e0",
                // backgroundColor: "#6d3b9f",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 1
        }, {
            ref: null, colors: {
                // outerBackgroundColor: "#8c62d0",
                // borderColor: "#b3a4e0",
                // backgroundColor: "#6d3b9f",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 2
        }
    ]);

    const onboardingContent: Content = {
        title: username + '\'s first lesson!',
        category: 'onboarding',
        author: '',
        body: 'Water is everywhere and is essential for life. But let\'s look at what water really is. Water is a made of hydrogen and oxygen - H₂O.',
        questions: [
            {
                question: 'What is the chemical formula for water?',
                choices: [
                    {
                        choice: 'CO₂',
                        correct: false
                    },
                    {
                        choice: 'H₂O',
                        correct: true
                    },
                    {
                        choice: 'O₂',
                        correct: false
                    },
                    {
                        choice: 'NH₃',
                        correct: false
                    }
                ]
            }
        ]
    }

    const cardsAddedAfterOnboardingContent = [
        // {
        //     ref: null, colors: {
        //         outerBackgroundColor: "#7453c7",
        //         borderColor: "#a58aeb",
        //         backgroundColor: "#3f1d8a",
        //         textColor: "#ffffff"
        //     }, index: 2
        // },
        {
            ref: null, colors: {
                // outerBackgroundColor: "#5a3494",
                // borderColor: "#8e6cbf",
                // backgroundColor: "#2e1463",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 3
        },
        {
            ref: null, colors: {
                // outerBackgroundColor: "#4a2583",
                // borderColor: "#6b4abf",
                // backgroundColor: "#1e0d4d",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 4
        },
        {
            ref: null, colors: {
                // outerBackgroundColor: "#3c2072",
                // borderColor: "#593d9e",
                // backgroundColor: "#190b3e",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 5
        },
        {
            ref: null, colors: {
                // outerBackgroundColor: "#331a61",
                // borderColor: "#4d3585",
                // backgroundColor: "#14082f",
                // textColor: "#ffffff"
                ...defaultColors
            }, index: 6
        }
    ]

    const [doneWithExampleQuestion, setDoneWithExampleQuestion] = useState(false);
    const [onboardingContentModalVisible, setOnboardingContentModalVisible] = useState(false);

    function openOnboardingContentModal() {
        setOnboardingContentModalVisible(true);

        if (!doneWithExampleQuestion) {
            setCards([...cards, ...cardsAddedAfterOnboardingContent]);
        }
    }

    function closeOnboardingContentModal() {
        setOnboardingContentModalVisible(false);
        scrollableCardsRef.current?.scrollToIndex(3);
        setDoneWithExampleQuestion(true);
    }

    const heights = {
        paddingAboveHeader: 0,
        headerHeight: Dimensions.get("window").height * 1,
        padding: 30,
        firstBoxHeight: (Dimensions.get("window").width - 30 * 2) * 1.6,
        boxHeight: (Dimensions.get("window").width - 30 * 2) * 1.6,
        footerHeight: Dimensions.get("window").height * 0.8,
    }

    // TODO: add swipe hint arrow
    return (
        <>
            <ScrollableCards<OnboardingCardAttributes>
                ref={scrollableCardsRef}
                data={cards}
                scrollable={username.length >= 3 && username.length <= 15}
                header={<OnboardingHeaderComponent username={username} setUsername={setUsername} height={undefined as never} arrowDown={undefined as never} />}
                headerArrowDown={username.length >= 3 && username.length <= 15}
                renderItem={({ item }) =>
                    <OnboardingCard
                        username={username} openOnboardingContentModal={openOnboardingContentModal}

                        focused={undefined as never} colors={undefined as never} style={undefined as never} index={undefined as never}
                    />
                }
                footer={
                    doneWithExampleQuestion ? <OnboardingFooterComponent username={username} height={undefined as never} /> : undefined
                }
                {...heights}
                initialBackgroundColor={theme.runwayBackgroundColor}
            />

            <ContentProvider
                isOnboardingContent={true}
                content={onboardingContent}
                colors={defaultColors}
                openContentModal={openOnboardingContentModal}
                closeContentModal={closeOnboardingContentModal}
            >
                <ContentModal
                    visible={onboardingContentModalVisible}
                />
            </ContentProvider>
        </>
    );
}