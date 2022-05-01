import {Vector3} from "three";
import {max} from "../../consts";

export default () => <>
  <hemisphereLight args={[0xB1E1FF, 0xaaaaaa, 0.3]}/>
  <ambientLight intensity={1}/>
  <directionalLight args={[0xffffff, 0.7]} position={new Vector3(max, max, max)}/>
</>