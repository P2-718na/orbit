import * as THREE from "three";

export default class Cloudchamber {

// public ////////////////////////////////////////////////
  constructor(edgeLength, vertexCount = 1E5, { pointCloudParameters, vertexSpeed }) {
    // Setup parameters
    this.vertexSpeed = vertexSpeed

    this.geometry = new THREE.BufferGeometry();
    this.vertices = [];

    // Set initial vertex positions
    for (let i = 0; i !== vertexCount; ++i) {

      // todo add randfloat function
      const x = edgeLength * Math.random() - edgeLength / 2;
      const y = Math.random();
      const z = edgeLength * Math.random() - edgeLength / 2;

      this.vertices.push(x, y, z);
    }

    this.#updatePosition();

    // Generate material from configuration
    this.material = new THREE.PointsMaterial(
      pointCloudParameters
    );
    this.material.color.setRGB(230, 230, 255); // todo maybe move this in config json if possible?

    this.#particles = new THREE.Points(this.geometry, this.material);
  }

  sceneElement() {
    return this.#particles;
  }

  loop(dt) {
    this.vertices = this.vertices.map((e, i) => {
      if ((i + 2) % 3 === 0) {
        const nextPos = (e - this.vertexSpeed * dt)
        return nextPos < 0 ? nextPos + 1 : nextPos; //todo do this with a modulo pls
      }

      return e
    })

    this.#updatePosition()
  }

// Private ////////////////////////////////////////////////
  #particles;

  #updatePosition() {
    this.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        this.vertices, 3
      )
    );
  }
}
