import React, { useMemo, useRef } from "react";
import { Mesh } from "three";
import * as THREE from "three";
import { MeshProps, useFrame } from "@react-three/fiber";

const levelToImage: Record<number, string> = {
    0: require("@/assets/planes/plane0.png"),
};

export default function Plane({ level = 0, ...props }: { level?: number } & MeshProps) {
    const mesh = useRef<Mesh>(null);
    const url = levelToImage[level];
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

    // useFrame((_, delta) => (mesh.current.rotation.x += delta));

    return (
        <mesh {...props} ref={mesh}>
            <planeGeometry />
            <meshStandardMaterial transparent map={texture} side={THREE.DoubleSide} />
        </mesh>
    );
}