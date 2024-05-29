import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import { Suspense, useRef } from "react";
import Plane from "../Plane";
import Particles from "../ParticleSphere";
import { View } from "react-native";
import { Styles } from "@/styles";
import { Cloud, Clouds, Environment, Sky, Sparkles, Stars, Trail } from "@react-three/drei/native";
import { MeshBasicMaterial, Vector3, MathUtils, Mesh, Group, Object3DEventMap } from "three";


function Rig({ children }: { children: React.ReactNode }) {
    const { camera, pointer } = useThree();
    const mesh = useRef<Group>(null);
    const vec = new Vector3();

    useFrame(() => {
        if (mesh.current) {
            camera.position.lerp(vec.set(pointer.x / 2, 0, 3.5), 0.05)
            // mesh.current.position.lerp(vec.set(pointer.x * 1, pointer.y * 0.1, 0), 0.1)
            // mesh.current.rotation.y = MathUtils.lerp(mesh.current.rotation.y, (-pointer.x * Math.PI) / 20, 0.1)
        }
    })

    return (
        <group ref={mesh}>
            {children}
        </group>
    )
}

export default function MainScene({ referenceSphere = false, props }: { referenceSphere?: boolean, props?: any }) {
    const [OrbitControls, events] = useControls();

    return (
        <View style={Styles.flex} {...events} {...props}>
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1], zoom: 100 }}
                // camera={{ position: [0, 0, 2] }}
            >
                {/* <OrbitControls
                    enablePan={false}
                /> */}
                <ambientLight />
                <Suspense fallback={null}>
                    <Sky distance={1000} sunPosition={[0, 0, 0]} inclination={0} azimuth={0.25} />
                    <Rig>
                        <Plane />
                        {referenceSphere && <Particles />}
                        {/* <Sparkles count={30} size={1} position={[0, 0.9, 0]} scale={[4, 1.5, 4]} speed={0.3} /> */}
                    </Rig>
                </Suspense>
            </Canvas>
        </View>
    );
}