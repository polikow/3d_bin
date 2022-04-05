import React from "react";
import {useStore} from "../../store/store";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";

export default () => {
    const [fov, position, target] = useStore(s => [s.fov, s.position, s.target])
    return (
        <>
            <PerspectiveCamera
                makeDefault
                fov={fov}
                position={position}
                far={1000000}
            />
            <OrbitControls target={target}/>
        </>
    )
};
