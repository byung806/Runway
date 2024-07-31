import { Styles } from "@/styles";
import { useContext } from "react";
import { View } from "react-native";
import Text from "./Text";
import { ThemeContext } from "./ThemeProvider";

export default function ListFooterComponent({ height }: { height: number }) {
    const theme = useContext(ThemeContext);
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