import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame, Object3DNode } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });
declare global {
    namespace JSX {
        interface IntrinsicElements {
            water: Object3DNode<Water, typeof Water>
        }
    }
}

function Ocean({...props}) {
    const ref = useRef<any>();
    const gl = useThree((state) => state.gl);
    const waterNormals = useLoader(
        THREE.TextureLoader, "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg"
    );


    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const geom = useMemo(() => new THREE.PlaneGeometry(100, 100), []);
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xeb8934,
            waterColor: 0x0064b5,
            distortionScale: 40,
            fog: false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [waterNormals]
    );
    useFrame((state, delta) => {
        if (!ref.current) return;
        const material = ref.current.material as THREE.ShaderMaterial;
        material.uniforms.time.value += delta;

        ref.current.position.y -= delta;

    })

    return (
        <water
            {...props}
            receiveShadow
            ref={ref}
            args={[geom, config]}
            rotation-x={-Math.PI / 2}
            position={props.position || [0, -20, 0]}
        />
    );
}

export default Ocean;