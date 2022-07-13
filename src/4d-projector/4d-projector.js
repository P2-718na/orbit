import * as THREE from "three";

export default class Projector4 {
// private ////////////////////////////////////////////////
  #origin = new THREE.Vector3( 0, 0, 0 );

  #base = [
    new THREE.Vector3( 1,  0,  0).normalize(),
    new THREE.Vector3( 0,  1,  0).normalize(),
    new THREE.Vector3( 0,  0,  1).normalize(),
    new THREE.Vector3(-1, -1, -1).normalize(),
  ];

  #axesColors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xffff00,
  ];

  #axes = new THREE.Group();

// public ////////////////////////////////////////////////
  constructor(/*todo*/) {

    this.#base.forEach((axis, i) => {
      const length = 1;

      const arrowHelper = new THREE.ArrowHelper( axis, this.#origin, length, this.#axesColors[i]);
      this.#axes.add(arrowHelper)
    })
  }

  sceneElement() {
    return this.#axes;
  }

  loop(dt) {

  }
}
