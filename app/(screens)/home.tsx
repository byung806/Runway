import { MainButton } from "@/components/screens";
import React, { Suspense } from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Debug, Styles } from "@/styles";

import Plane from "@/components/game/Plane";

import { Canvas } from "@react-three/fiber";
import useControls from "r3f-native-orbitcontrols";


export default function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const [OrbitControls, setOrbitControls] = useControls();

    return (
        <Canvas
        // orthographic
        // camera={{ position: [1, 1, 1], scale: [0.01, 0.01, 0.01] }}
        camera={{ position: [1.5, 1.5, 1.5] }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[-1, 2, 2]} intensity={4} />
            <pointLight position={[1, 0, 0]} intensity={10} />
            <Suspense fallback={null}>
                <Plane />
                {/* <TwistedBox /> */}
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
};
