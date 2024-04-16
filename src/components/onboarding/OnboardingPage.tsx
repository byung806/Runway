import { View, Text } from "react-native";
import { Colors, Styles } from "@/styles";
import Footer from "./Footer";
import Header from "./Header";
import { SafeAreaView } from "react-native";

interface OnboardingPageProps {
    backgroundColor?: string;
    buttonText?: string;
    prevButtonCallback?: () => void;
    nextButtonCallback: () => void;
    children: JSX.Element;
}

export default function OnboardingPage({ backgroundColor=Colors.light.white, buttonText='NEXT', prevButtonCallback, nextButtonCallback, children }: OnboardingPageProps) {
    return (
        <View
            style={{
                backgroundColor: backgroundColor,
                flex: 1
            }}
        >
            <SafeAreaView style={Styles.flex}>
                <Header
                    backgroundColor={Colors.light.white}
                    prevButtonCallback={prevButtonCallback}
                />
                <View
                    style={{
                        ...Styles.centeredContainer,
                        flex: 1,
                        backgroundColor: backgroundColor
                    }}
                >
                    {children}
                </View>
                <Footer
                    backgroundColor={Colors.light.white}
                    buttonLabel={buttonText}
                    buttonCallback={nextButtonCallback}
                />
            </SafeAreaView>
        </View>
    );
}