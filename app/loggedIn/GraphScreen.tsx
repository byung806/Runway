/**
 * @description Main "graph" screen for the app. Implements a 2D force graph, each node representing a lesson.
 * 
 * @exports GraphScreen
 * 
 * @author Bryan Yung
 */

import ForceGraphD3New from "@/components/2d/ForceGraphD3New";
import { useFirebase, useRunwayTheme } from "@/providers";
import { View } from "react-native";

export default function GraphScreen() {
    const theme = useRunwayTheme();
    const firebase = useFirebase();

    return (
        <View style={{ flex: 1, backgroundColor: theme.graphBackgroundColor }}>
            {/* <SafeAreaView style={{ flex: 1 }}> */}
            <ForceGraphD3New />
            {/* </SafeAreaView> */}
        </View>
    );
}