import { animated, config, useSpring } from '@react-spring/three';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Mesh } from "three";


const planeTypeToImage: Record<number, string> = {
    0: require("@/assets/planes/plane0.png"),
};

export type PlaneRef = {
	land: () => void;
    takeoff: () => void;
    devToggle: () => void;
};

interface Props {
    planeType?: number;
}

export const Plane = forwardRef<PlaneRef, Props>( (props, ref) => {
    const mesh = useRef<Mesh>(null);
    const url = planeTypeToImage[props.planeType ?? 0];
    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

    // allows the main scene to call these functions with a ref
    useImperativeHandle(ref, () => ({
		land: () => {
			land();
		},
        takeoff: () => {
            takeoff();
        },
        devToggle: () => {
            devToggle();
        }
	}));

    const [active, setActive] = useState(false);
    const { scale } = useSpring({
        scale: active ? 1.2 : 1,
        config: config.wobbly,
    })

    const [groundLevel, setGroundLevel] = useState(false);
    const { position } = useSpring({
        position: groundLevel ? [0, -4.9, 0] : [0, 0, 0],
        config: config.molasses,
    })

    function devToggle() {
        setActive(!active);
        setGroundLevel(!groundLevel);
    }

    function land() {
        setActive(true);
        setGroundLevel(true);
    }

    function takeoff() {
        setActive(false);
        setGroundLevel(false);
    }

    return (
        // @ts-expect-error
        <animated.mesh {...props} scale={scale} position={position} onPointerUp={() => {setActive(false)}} onPointerDown={() => {setActive(true)}} ref={mesh} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} castShadow>
            <planeGeometry />
            <meshStandardMaterial transparent={false} alphaTest={0.5} map={texture} side={THREE.DoubleSide} />
        </animated.mesh>
    );
});