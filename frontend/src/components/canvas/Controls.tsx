import React, {useEffect, useRef} from "react";
import {useStore} from "../../store/store";
import {OrbitControls} from "@react-three/drei";

const target = useStore.getState().target

const Controls = () => {
  const controls = useRef<any>(null!)
  useEffect(() => {
    useStore.subscribe(s => s.target, ({x, y, z}) => controls.current.target.set(x, y, z))
  }, [])
  return <OrbitControls ref={controls} target={target}/>
}

export default Controls