import * as THREE from "three";
import project_vertexGlsl from "three/src/renderers/shaders/ShaderChunk/project_vertex.glsl";
const mm = require('matrix-multiplication') // fixme this thing is sketchy af. Maybe rewrite.
const rowColMul4 = mm()(4) // We need to multiply columns vectors with 4 rows to matrices with 4 columns

export default class Projector4 {
// private ////////////////////////////////////////////////
  #origin = new THREE.Vector3( 0, 0, 0 );

  #base = [
    new THREE.Vector3( 1,  0,  0).normalize(),
    new THREE.Vector3( 0,  1,  0).normalize(),
    new THREE.Vector3( 0,  0,  1).normalize(),
    new THREE.Vector3(-1, -1, -1).normalize(),
  ];
  #projectionMatrix = []

  #axesColors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xffff00,
  ];

  #axes = new THREE.Group();

// private methods /////////////////////////////////////////////
  #projectVector4(element) {
    const projectedVector = rowColMul4(this.#projectionMatrix, element.toArray());
    // We want this to be a THREE Vector3 object:
    return new THREE.Vector3(...projectedVector);
  }

// public ////////////////////////////////////////////////
  constructor(/*todo*/) {

    // We will need to transpose this...
    const projectionMatrixT = [
      this.#base[0].toArray(),
      this.#base[1].toArray(),
      this.#base[2].toArray(),
      this.#base[3].toArray(),
    ]

    // transpose it and write as array:
    // Thanks SO: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    this.#projectionMatrix = projectionMatrixT[0]
      .map((_, colIndex) => projectionMatrixT.map(row => row[colIndex]))
      // Also we need the matrix to be a single array
      .reduce((acc, row) => {
        acc.push(...row)

        return acc;
      }, []);

    // todo move this to test area
    // todo create test area
    // console.log(this.#projectionMatrix)
    // console.log(rowColMul4(this.#projectionMatrix, [0, 0, 0, 1]))
    // console.log(rowColMul4(this.#projectionMatrix, [0, 0, 1, 0]))
    // console.log(rowColMul4(this.#projectionMatrix, [0, 1, 1, 0]))

    this.#base.forEach((axis, i) => {
      const length = 1;

      const arrowHelper = new THREE.ArrowHelper(axis, this.#origin, length, this.#axesColors[i]);
      this.#axes.add(arrowHelper)
    })
  }

  project3(element) {
    if (element.isVector4) {
      return this.#projectVector4(element)
    }

    throw "Can't project that, sorry :("
  }

  sceneElement() {
    return this.#axes;
  }

  loop(dt) {

  }
}
