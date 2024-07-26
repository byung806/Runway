import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Styles } from '@/styles';

import { useContext } from 'react';
import OnboardingFooter from './OnboardingFooter';
import OnboardingHeader from './OnboardingHeader';
import { ThemeContext } from './ThemeProvider';

interface OnboardingPageProps {
    backgroundColor?: string;
    buttonText?: string;
    prevButtonCallback?: () => void;
    nextButtonCallback: () => void;
    children: JSX.Element;
}

export default function OnboardingPage({ backgroundColor, buttonText = 'NEXT', prevButtonCallback, nextButtonCallback, children }: OnboardingPageProps) {
    const theme = useContext(ThemeContext);

    return (
        <View
            style={{
                backgroundColor: backgroundColor,
                flex: 1
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <OnboardingHeader
                    prevButtonCallback={prevButtonCallback}
                />
                <View
                    style={{
                        ...Styles.centeringContainer,
                        flex: 1,
                        backgroundColor: backgroundColor || theme.background
                    }}
                >
                    {children}
                </View>
                <OnboardingFooter
                    buttonLabel={buttonText}
                    buttonCallback={nextButtonCallback}
                />
            </SafeAreaView>
        </View>
    );
}
