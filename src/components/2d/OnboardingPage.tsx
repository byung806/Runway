import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Styles } from '@/styles';
import { useTheme } from '@react-navigation/native';

import OnboardingFooter from './OnboardingFooter';
import OnboardingHeader from './OnboardingHeader';

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
                <OnboardingHeader
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
                <OnboardingFooter
                    backgroundColor={backgroundColor || colors.background}
                    buttonLabel={buttonText}
                    buttonCallback={nextButtonCallback}
                />
            </SafeAreaView>
        </View>
    );
}