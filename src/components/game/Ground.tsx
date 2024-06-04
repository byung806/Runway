import React, { useMemo, useRef } from 'react';
import * as THREE from "three";
import { MeshProps, useFrame } from "@react-three/fiber";


export default function Ground({ ...props }: MeshProps) {
    const mesh1 = useRef<THREE.Mesh>(null);
    const mesh2 = useRef<THREE.Mesh>(null);

    const url = require("@/assets/bg.png");
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

    useFrame((_, delta) => {
        const height = 10;
        if (mesh1.current) {
            mesh1.current.position.y -= delta;
            if (mesh1.current.position.y <= -height) {
                mesh1.current.position.y = height;
            }
        }
        if (mesh2.current) {
            mesh2.current.position.y -= delta;
            if (mesh2.current.position.y <= -height) {
                mesh2.current.position.y = height;
            }
        }
    });

    return (
        <group>
            <mesh ref={mesh1} {...props} position={[0, 10, -100]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={mesh2} {...props} position={[0, 0, -100]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide}  />
            </mesh>
        </group>
    );
}