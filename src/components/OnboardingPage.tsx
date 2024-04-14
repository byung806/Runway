import { View, Text } from "react-native";
import { Feather as Icon } from '@expo/vector-icons';
import { Styles } from "@/styles";

interface OnboardingPageProps {
    backgroundColor: string;
    iconName: any;
    title: string;
}

export default function OnboardingPage({ backgroundColor, iconName, title }: OnboardingPageProps) {
    return (
        <View
            style={{
                ...Styles.centeredContainer,
                backgroundColor: backgroundColor
            }}
        >
            <Icon name={iconName} size={172} color="white" />
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                    {title}
                </Text>
            </View>
        </View>
    );
}