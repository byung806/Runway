import { useRef } from "react";
import { Points } from "three";

export default function Particles() {
        const points = useRef<Points>(null);
    
        return (
            <points ref={points}>
                <sphereGeometry args={[1, 48, 48]} />
                <pointsMaterial color="#5786F5" size={0.015} sizeAttenuation />
            </points>
        );
};
