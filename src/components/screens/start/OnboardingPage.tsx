import { View } from "react-native";
import { Colors, Styles } from "@/styles";
import Footer from "./Footer";
import Header from "./BackHeader";
import { SafeAreaView } from "react-native";

interface OnboardingPageProps {
    backgroundColor?: string;
    buttonText?: string;
    prevButtonCallback?: () => void;
    nextButtonCallback: () => void;
    children: JSX.Element;
}

export default function OnboardingPage({ backgroundColor=Colors.light.background, buttonText='NEXT', prevButtonCallback, nextButtonCallback, children }: OnboardingPageProps) {
    return (
        <View
            style={{
                backgroundColor: backgroundColor,
                flex: 1
            }}
        >
            <SafeAreaView style={Styles.flex}>
                <Header
                    backgroundColor={backgroundColor}
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
                    backgroundColor={backgroundColor}
                    buttonLabel={buttonText}
                    buttonCallback={nextButtonCallback}
                />
            </SafeAreaView>
        </View>
    );
}