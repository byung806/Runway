import { Styles } from "@/styles";
import { useTheme } from "@react-navigation/native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import React, { Suspense, useRef } from "react";
import { Button, View } from "react-native";
import { Group, Vector3 } from "three";
import { Ground, GroundRef } from "../Ground";
import Particles from "../ParticleSphere";
import { Plane, PlaneRef } from "../Plane";


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
    // TODO: landing/takeoff
    // TODO: different planes
    // TODO: different destinations / daily location
    // TODO: tilt plane towards camera
    // TODO: add a way to change sky color
    // TODO: ticking clock ui for next destination
    const plane = useRef<PlaneRef>();
    const ground = useRef<GroundRef>();

    const [OrbitControls, events] = useControls();

    function newDay(islandFile?: string) {
        if (!plane.current || !ground.current) return;
        plane.current.devToggle();
    }

    return (
        <View style={Styles.flex} {...events} {...props}>
            <Canvas
                shadows
                orthographic
                camera={{ position: [0, 10, 0], zoom: 100 }}
                onCreated={(state) => { const _gl = state.gl.getContext(); const pixelStorei = _gl.pixelStorei.bind(_gl); _gl.pixelStorei = function(...args) { const [parameter] = args; switch(parameter) { case _gl.UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) } } }}
            >
            {/* <Canvas
                shadows
                camera={{ position: [0, 10, 0], zoom: 3, rotation: [0, Math.PI/3, 0] }}
                onCreated={(state) => { const _gl = state.gl.getContext(); const pixelStorei = _gl.pixelStorei.bind(_gl); _gl.pixelStorei = function(...args) { const [parameter] = args; switch(parameter) { case _gl.UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) } } }}
            > */}
                <OrbitControls
                    enablePan={false}
                />
                <ambientLight intensity={1} />
                <directionalLight castShadow intensity={2} />
                <Suspense fallback={null}>
                    <Rig>
                        {/* @ts-expect-error */}
                        <Plane ref={plane} planeType={0} />
                        {/* @ts-expect-error */}
                        <Ground ref={ground} />
                        {referenceSphere && <Particles />}
                    </Rig>
                </Suspense>
            </Canvas>
            <Button title="new day (dev)" onPress={() => {newDay('file')}} />
        </View>
    );
}