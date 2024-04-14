import { View, Text } from "react-native";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { Styles } from "@/styles";

interface OnboardingPageProps {
    backgroundColor: string;
    iconName: any;
    iconColor: string;
    title: string;
}

export default function OnboardingPage({ backgroundColor, iconName, iconColor, title }: OnboardingPageProps) {
    return (
        <View
            style={{
                ...Styles.centeredContainer,
                flex: 1,
                backgroundColor: backgroundColor
            }}
        >
            <Icon name={iconName} size={144} color={iconColor} />
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: iconColor }}>
                    {title}
                </Text>
            </View>
        </View>
    );
}