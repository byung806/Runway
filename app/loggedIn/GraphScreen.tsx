import { ForceGraph } from "@/components/2d/ForceGraph";
import ForceGraphD3 from "@/components/2d/ForceGraphD3";
import { ThemeContext } from "@/providers";
import { useContext } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GraphScreen() {
    const theme = useContext(ThemeContext);
    
    return (
        <View style={{ flex: 1, backgroundColor: theme.graphBackgroundColor }}>
            {/* <SafeAreaView style={{ flex: 1 }}> */}
                <ForceGraphD3 />
            {/* </SafeAreaView> */}
        </View>
    );
}