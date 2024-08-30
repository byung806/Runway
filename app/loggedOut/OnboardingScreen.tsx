import { BaseCardAttributes, ScrollableCards, ScrollableCardsRef } from '@/components/2d';
import React, { useContext, useState } from 'react';
import { Dimensions, View } from 'react-native';

import ContentModal from '@/components/2d/ContentModal';
import OnboardingCard from '@/components/2d/OnboardingCard';
import OnboardingFooterComponent from '@/components/2d/OnboardingFooterComponent';
import OnboardingHeaderComponent from '@/components/2d/OnboardingHeaderComponent';
import { FirebaseContent, ContentProvider, ThemeContext } from '@/providers';
import { StackNavigationProp } from '@react-navigation/stack';
import { Styles } from '@/styles';


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
                outerBackgroundColor: "#190723",
                borderColor: "#941475",
                backgroundColor: "#320f3b",
                textColor: "#74dc80"
            }, index: 2
        }
    ]);

    const onboardingContent: FirebaseContent = {
        title: username + '\'s first lesson!',
        category: 'onboarding',
        author: '',
        chunks: [
            {
                type: 'image',
                uri: 'https://www.civitatis.com/blog/wp-content/uploads/2021/10/10-mejores-destinos-auroras-boreales.jpg'
            },
            {
                type: 'paragraph',
                text: 'We all know auroras as nature\'s beautiful light show. But how do they work? They start with the Sun - our sun is constantly sending out tiny particles called solar wind.'
            },
            {
                type: 'image',
                uri: 'https://www.worldatlas.com/r/w1200/upload/43/6d/74/shutterstock-752393257.jpg'
            },
            {
                type: 'paragraph',
                text: 'These particles are super energetic and zoom through space at incredible speeds. Earth has a protective force field called the magnetic field. Usually, it shields us from the solar wind, but near the North and South Poles, some particles sneak through.'
            },
            {
                type: 'image',
                uri: 'https://scx2.b-cdn.net/gfx/news/hires/2021/energyfromso.jpg'
            },
            {
                type: 'paragraph',
                text: 'Here\'s where the magic happens: these particles slam into atoms in our atmosphere, mostly oxygen and nitrogen. Oxygen atoms glow green or red, while nitrogen glows blue or purple. The result? A dazzling display of lights that dance and swirl in the sky!'
            },
            {
                type: 'question',
                question: 'What causes the different colors in an aurora?',
                choices: [
                    {
                        choice: 'The atmosphere\'s temperature',
                        correct: false
                    },
                    {
                        choice: 'Which atoms particles hit',
                        correct: true
                    },
                    {
                        choice: 'Earth\'s rotation speed',
                        correct: false
                    },
                    {
                        choice: 'The intensity of the Sun',
                        correct: false
                    }
                ],
            },
            {
                type: 'question',
                question: 'If a planet was discovered that only had yellow auroras, what would this suggest?',
                choices: [
                    {
                        choice: 'The atmosphere is very thin',
                        correct: false
                    },
                    {
                        choice: 'The planet has a weak magnetic field',
                        correct: false
                    },
                    {
                        choice: 'The atmosphere only contains one type of gas',
                        correct: true
                    },
                    {
                        choice: 'The planet is very hot',
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

    const padding = 30;
    const boxHeight = (Dimensions.get("window").width - padding * 2) * 1.4;
    const heights = {
        paddingAboveHeader: 0,
        headerHeight: Dimensions.get("window").height * 1,
        // headerHeight: (Dimensions.get("window").height - ((Dimensions.get("window").width - 30 * 2) * 1.6)) / 2 - 30 / 2
        padding: padding,
        boxHeight: boxHeight,
        footerHeight: Dimensions.get("window").height * 0.8,
    };

    return (
        <View style={{ flex: 1 }}>
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
                colors={cards[2].colors}
                openContentModal={openOnboardingContentModal}
                closeContentModal={closeOnboardingContentModal}
            >
                <ContentModal
                    visible={onboardingContentModalVisible}
                />
            </ContentProvider>
        </View>
    );
}