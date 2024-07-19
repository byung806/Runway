import { Styles } from "@/styles";
import { View } from "react-native";
import Text from "./Text";

export default function ListFooterComponent({ height }: { height: number }) {
    return (
        <View style={{
            height,
            ...Styles.centeringContainer,
        }}>
            <Text style={{ fontSize: 20 }}>End of list</Text>
        </View>
    );
}