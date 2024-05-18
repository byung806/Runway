import { MainButton } from "@/components/screens";
import React, { Suspense, useRef, useState } from "react";
import { View } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Debug, Styles } from "@/styles";

import Plane from "@/components/game/Plane";

import { Canvas, MeshProps, useFrame } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import Particles from "@/components/game/Particles";
import { Mesh, PerspectiveCamera } from "three";


export default function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<any, any> }) {
    const [OrbitControls, events] = useControls();

    return (
        <View style={{ flex: 1 }} {...events}>
            <Canvas
                // orthographic
                // camera={{ position: [1, 1, 1], scale: [0.01, 0.01, 0.01] }}
                camera={{position: [0, 0, 2]}}
            >
                <OrbitControls
                    minZoom={5}
                    maxZoom={10}
                    enablePan={false}
                />
                <ambientLight />
                <Suspense fallback={null}>
                    <Plane />
                    <Particles />
                </Suspense>
            </Canvas>
        </View>
    );
};
