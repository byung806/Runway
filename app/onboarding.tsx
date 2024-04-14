import { Footer, MainButton, OnboardingPage } from "@/components";
import { Colors } from "@/styles";
import { View, Image } from "react-native";
import ViewPager from "react-native-pager-view"


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

export default function OnboardingScreen() {
    return (
        <View style={{ flex: 1 }}>
            <ViewPager style={{ flex: 1 }}>
                <View key="1">
                    <OnboardingPage
                        backgroundColor={Colors.light.white}
                        iconName="paper-plane"
                        iconColor={Colors.light.accent}
                        title="Welcome to Runway"
                    />
                    <Footer
                        backgroundColor={Colors.light.white}
                        buttonLabel="Next"
                        buttonCallback={() => {}}
                    />
                </View>
                <View key="2">
                    <OnboardingPage
                        backgroundColor="#07689f"
                        iconName="plane"
                        iconColor={Colors.light.black}
                        title="Take off with daily puzzles"
                    />
                </View>
            </ViewPager >
        </View >
    );
}
