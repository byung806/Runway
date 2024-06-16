import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { animated, config, useSpring } from '@react-spring/three';
import { useFrame, useLoader } from '@react-three/fiber';

export type GroundRef = {
    land: () => void;
    takeoff: () => void;
};

interface Props { }

export const Ground = forwardRef<GroundRef, Props>((props, ref) => {
    const length = 20;  // square length x length
    const initialY = -5;

    const mesh1 = useRef<THREE.Mesh>(null);
    const mesh2 = useRef<THREE.Mesh>(null);

    const url = require("@/assets/bg.png");
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

    const normals = useLoader(
        THREE.TextureLoader, "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg"
    );
    normals.wrapS = normals.wrapT = THREE.RepeatWrapping;

    useFrame((_, delta) => {
        if (!mesh1.current || !mesh2.current) return;
        mesh1.current.position.x -= delta * 3;
        if (mesh1.current.position.x <= -length) {
            mesh1.current.position.x = length;
            mesh2.current.position.x = 0;
        }
        mesh2.current.position.x -= delta * 3;
        if (mesh2.current.position.x <= -length) {
            mesh2.current.position.x = length;
            mesh1.current.position.x = 0;
        }

        // landing
        // mesh1.current.position.y += delta*2 * -mesh1.current.position.y;
        // mesh2.current.position.y += delta*2 * -mesh2.current.position.y;
    });

    useImperativeHandle(ref, () => ({
        land: () => {
            land();
        },
        takeoff: () => {
            takeoff();
        }
    }));

    const [groundLevel, setGroundLevel] = useState(false);
    const { position } = useSpring({
        position: groundLevel ? [0, -0.1, 0] : [0, initialY, 0],
        config: config.molasses,
    })  // TODO: solve animation stopping the useEffect scroll animation

    function land() {
        // TODO: animate so it slows down
    }

    function takeoff() {
        // TODO: animate so it speeds back up
    }

    return (
        <group>
            <animated.mesh {...props} ref={mesh1} position={[length, initialY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[length, length]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </animated.mesh>
            <animated.mesh {...props} ref={mesh2} position={[0, initialY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[length, length]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </animated.mesh>
        </group>
    );
});