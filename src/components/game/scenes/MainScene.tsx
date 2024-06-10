import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import React, { Suspense, useRef } from "react";
import Plane from "../Plane";
import Particles from "../ParticleSphere";
import { View } from "react-native";
import { Styles } from "@/styles";
import { Sky } from "@react-three/drei/native";
import { Vector3, Group } from "three";
import { useTheme } from "@react-navigation/native";
import Ground from "../Ground";


function Rig({ children }: { children: React.ReactNode }) {
    const { camera, pointer } = useThree();
    const mesh = useRef<Group>(null);
    const vec = new Vector3();

    useFrame(() => {
        // if (mesh.current) {
        //     camera.position.lerp(vec.set(pointer.x / 2, 0, 3.5), 0.05)
        //     // mesh.current.position.lerp(vec.set(pointer.x * 1, pointer.y * 0.1, 0), 0.1)
        //     // mesh.current.rotation.y = MathUtils.lerp(mesh.current.rotation.y, (-pointer.x * Math.PI) / 20, 0.1)
        // }
    })

    return (
        <group ref={mesh}>
            {children}
        </group>
    )
}

export default function MainScene({ referenceSphere = false, props }: { referenceSphere?: boolean, props?: any }) {
    const { colors } = useTheme();
    // TODO: add a way to change sky color

    const [OrbitControls, events] = useControls();

    return (
        <View style={Styles.flex} {...events} {...props}>
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1], zoom: 100 }}
                onCreated={(state) => { const _gl = state.gl.getContext(); const pixelStorei = _gl.pixelStorei.bind(_gl); _gl.pixelStorei = function(...args) { const [parameter] = args; switch(parameter) { case _gl.UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) } } }}
            >
                {/* <OrbitControls
                    enablePan={false}
                /> */}
                <ambientLight intensity={2} />
                <Suspense fallback={null}>
                    <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} {...props} />
                    <Rig>
                        <Plane level={0} />
                        <Ground />
                        {referenceSphere && <Particles />}
                    </Rig>
                </Suspense>
            </Canvas>
        </View>
    );
}