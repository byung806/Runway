import { Styles } from "@/styles";
import { useContext } from "react";
import { View } from "react-native";
import Text from "./Text";
import { ThemeContext } from "@/providers";

export default function ListFooterComponent({ height, arrowUp, showError }: { height: number, arrowUp: JSX.Element, showError: boolean }) {
    const theme = useContext(ThemeContext);

    if (!showError) {
        return (
            <View style={{
                height,
                gap: 20,
                ...Styles.centeringContainer,
            }}>
                <View style={{ ...Styles.centeringContainer, gap: 10 }}>
                    {arrowUp}
                    <Text style={{ fontSize: 30, ...Styles.lightShadow, color: theme.runwayTextColor, textAlign: 'center' }}>
                        {/* {firebase.userData?.username} */}
                        <Text style={{ color: theme.white }}>Great job! You reached the end of available content!</Text>
                    </Text>
                </View>
            </View>
        );
    }
    return (
        <View style={{
            height,
            gap: 20,
            ...Styles.centeringContainer,
        }}>
            <Text style={{ fontSize: 40, color: theme.white }}>Houston, we have a problem...</Text>
            <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 60, color: theme.white }}>Please check back later for content!</Text>
        </View>
    );
}