import { Canvas } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import { Suspense } from "react";
import Plane from "../Plane";
import Particles from "../ParticleSphere";
import { View } from "react-native";
import { Styles } from "@/styles";
import { Sparkles } from "@react-three/drei";

export default function MainScene({referenceSphere = false, props}: {referenceSphere?: boolean, props?: any}) {
    const [OrbitControls, events] = useControls();

    return (
        <View style={Styles.flex} {...events} {...props}>
            <Canvas
                // orthographic
                // camera={{ position: [1, 1, 1], scale: [0.01, 0.01, 0.01] }}
                camera={{ position: [0, 0, 2] }}
            >
                <OrbitControls
                    minZoom={2}
                    maxZoom={10}
                    enablePan={false}
                />
                <ambientLight />
                <Suspense fallback={null}>
                    <Plane />
                    {referenceSphere && <Particles />}
                    <Sparkles count={30} size={1} position={[0, 0.9, 0]} scale={[4, 1.5, 4]} speed={0.3} />
                </Suspense>
            </Canvas>
        </View>
    );
}