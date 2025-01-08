import { ForceGraph } from "@/components/2d/ForceGraph";
import ForceGraphD3 from "@/components/2d/ForceGraphD3";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GraphScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <SafeAreaView style={{ flex: 1 }}> */}
                <ForceGraphD3 />
            {/* </SafeAreaView> */}
        </View>
    );
}