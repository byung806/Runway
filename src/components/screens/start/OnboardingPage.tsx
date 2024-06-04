import { View } from "react-native";
import { Colors, Styles } from "@/styles";
import Footer from "./Footer";
import Header from "./BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";


interface OnboardingPageProps {
    backgroundColor?: string;
    buttonText?: string;
    prevButtonCallback?: () => void;
    nextButtonCallback: () => void;
    children: JSX.Element;
}

export default function OnboardingPage({ backgroundColor, buttonText='NEXT', prevButtonCallback, nextButtonCallback, children }: OnboardingPageProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: backgroundColor,
                flex: 1
            }}
        >
            <SafeAreaView style={Styles.flex}>
                <Header
                    backgroundColor={backgroundColor || colors.background}
                    prevButtonCallback={prevButtonCallback}
                />
                <View
                    style={{
                        ...Styles.centeringContainer,
                        flex: 1,
                        backgroundColor: backgroundColor
                    }}
                >
                    {children}
                </View>
                <Footer
                    backgroundColor={backgroundColor || colors.background}
                    buttonLabel={buttonText}
                    buttonCallback={nextButtonCallback}
                />
            </SafeAreaView>
        </View>
    );
}