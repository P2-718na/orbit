import * as THREE from "three";

export default class Cloudchamber {
  // Private ////////////////////////////////////////////////
  #particles;
  #geometry = new THREE.BufferGeometry();
  #material = new THREE.PointsMaterial;
  #vertices;

  // Parameters ///////
  #edgeLength;
  #vertexCount;
  #vertexSpeed;



  #initializeParameters = ({ edgeLength, vertexCount, vertexSpeed }) => {
    this.#edgeLength  = edgeLength  ?? 50;
    this.#vertexCount = vertexCount ?? 1E4;
    this.#vertexSpeed = vertexSpeed ?? .1;
  }

  #updatePosition() {
    this.#geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        this.#vertices, 3
      )
    );
  }

// public ////////////////////////////////////////////////
  constructor(cloudchamberParameters, pointCloudParameters) {
    // Setup parameters
    this.#initializeParameters(cloudchamberParameters);

    // Set initial vertex positions
    this.#vertices = new Float32Array(this.#vertexCount * 3);
    for (let i = 0; i !== this.#vertexCount; ++i) {

      // todo add randfloat function
      const x = this.#edgeLength * Math.random() - this.#edgeLength / 2;
      const y = Math.random();
      const z = this.#edgeLength * Math.random() - this.#edgeLength / 2;

      this.#vertices[3 * i]     = x;
      this.#vertices[3 * i + 1] = y;
      this.#vertices[3 * i + 2] = z;
    }

    this.#updatePosition();

    // Generate material from configuration
    this.#material.setValues(pointCloudParameters);
    this.#material.color.setRGB(230, 230, 255); // todo maybe move this in config json if possible?

    this.#particles = new THREE.Points(this.#geometry, this.#material);
  }

  sceneElement() {
    return this.#particles;
  }

  loop(dt) {
    this.#vertices = this.#vertices.map((e, i) => {
      if ((i + 2) % 3 === 0) {
        const nextPos = (e - this.#vertexSpeed * dt)
        return nextPos < 0 ? nextPos + 1 : nextPos; //todo do this with a modulo pls
      }

      return e
    })

    this.#updatePosition()
  }
}
