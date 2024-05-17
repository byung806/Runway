import React, { useMemo, useRef } from "react";
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const levelToImage: Record<number, string> = {
    0: require("@/assets/planes/plane0.png"),
};

export default function Plane({level = 0}: {level?: number}) {
    const mesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null);
    // const materialProps = useMemo<
    //     Partial<THREE.MeshBasicMaterial & THREE.MeshLambertMaterial>
    // >(
    //     () => ({
    //         color: new THREE.Color(color),
    //         opacity,
    //         blending,
    //         transparent: true,
    //         depthTest: false,
    //         depthWrite: false,
    //         fog: false,
    //         flatShading: true,
    //         precision: 'lowp',
    //     }),
    //     [opacity, blending, color]
    // );

    // const textureProps = useMemo<Partial<THREE.Texture>>(() => {
    //     const size = {
    //         x: image.width / frameWidth,
    //         y: image.height / frameHeight,
    //     };
    //     return {
    //         image,
    //         repeat: new THREE.Vector2(1 / size.x, 1 / size.y),
    //         magFilter,
    //         minFilter: THREE.LinearMipMapLinearFilter,
    //     };
    // }, [frameHeight, frameWidth, image, magFilter]);

    
    const url = levelToImage[level];
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.x += 0.02;
        }
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry />
            <meshStandardMaterial transparent map={texture} side={THREE.DoubleSide} />
        </mesh>
    )
}