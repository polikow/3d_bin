import * as THREE from "three"
/* eslint import/no-webpack-loader-syntax: off */ // @ts-ignore
import vertexShader from "!!raw-loader!./grid.vs.glsl"
/* eslint import/no-webpack-loader-syntax: off */ // @ts-ignore
import fragmentShader from "!!raw-loader!./grid.fs.glsl"

class Grid extends THREE.Mesh {

  static readonly GEOMETRY = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

  static readonly SHADER = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    extensions: {derivatives: true},
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })

  static createGeometry() {
    return Grid.GEOMETRY.clone()
  }

  static createShaderMaterial(uniforms: ShaderParameters) {
    const shader = Grid.SHADER.clone();
    shader.uniforms = uniforms;
    return shader;
  }

  constructor(width = 2, height = 2, cellSize = 1, color: THREE.ColorRepresentation = "grey") {
    super(
      Grid.createGeometry(),
      Grid.createShaderMaterial({
        u_size: {value: cellSize},
        u_width: {value: width},
        u_height: {value: height},
        u_color: {value: new THREE.Color(color)}
      })
    )
  }

  setSize(w: number, h: number): Grid {
    (this.material as THREE.ShaderMaterial).uniforms.u_width.value = w;
    (this.material as THREE.ShaderMaterial).uniforms.u_height.value = h;
    return this
  }

  setCellSize(n: number) {
    if (n <= 0) throw Error
      // @ts-ignore
    this.material.uniforms.u_size.value = n
  }
}

type ShaderParameters = {
  u_size: THREE.IUniform<number>
  u_width: THREE.IUniform<number>
  u_height: THREE.IUniform<number>
  u_color: THREE.IUniform<THREE.Color>
}

export default Grid