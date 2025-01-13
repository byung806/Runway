/**
 * @description Main "graph" screen for the app. Implements a 2D force graph, each node representing a lesson.
 * 
 * @exports GraphScreen
 * 
 * @author Bryan Yung
 */

import ContentModal from "@/components/2d/ContentModal";
import { ForceGraph } from "@/components/2d/ForceGraph";
import ForceGraphD3 from "@/components/2d/ForceGraphD3";
import ForceGraphD3New from "@/components/2d/ForceGraphD3New";
import { ContentProvider, FirebaseContent, useFirebase, useRunwayTheme } from "@/providers";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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