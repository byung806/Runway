import { Styles } from "@/styles";
import { View } from "react-native";
import Text from "./Text";

export default function ListFooterComponent({ height }: { height: number }) {
    return (
        <View style={{
            height,
            gap: 20,
            ...Styles.centeringContainer,
        }}>
            <Text style={{ fontSize: 40 }}>Houston, we have a problem...</Text>
            <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 60 }}>Please check back later for content!</Text>
        </View>
    );
}