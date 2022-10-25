import * as THREE from "three";

const geometry = new THREE.SphereGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const defaultMesh = new THREE.Mesh(geometry, material);

export default class PointTrail {
  // private ////////////////////////////////////////////////
  #geometry;
  #material;

  #vertices = [];
  #particles;
  #maxVertices;

  #updatePosition() {
    this.#geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        this.#vertices, 3
      )
    );
  }

  // public /////////////////////////////////////////////////
  constructor(pointTrailParameters, maxVertices) {
    this.#geometry = new THREE.BufferGeometry();
    // Generate material from configuration
    this.#material = new THREE.LineBasicMaterial(
      pointTrailParameters
    );

    // No need to set initial vertex position for each vertex. Just memorize this value
    // to avoid excessive lag.
    this.#maxVertices = maxVertices

    this.#updatePosition();

    this.#particles = new THREE.Line(this.#geometry, this.#material);
    this.#particles.frustumCulled = false // fix disappearing particles when too close
  }

  addPoint(position) {
  // Shift all left by one position and push new position at the end
    while (this.#vertices.length > this.#maxVertices) {
      this.#vertices.shift(); // cleanme pls
      this.#vertices.shift();
      this.#vertices.shift();
    }

    this.#vertices.push(...position)
    this.#updatePosition()
  }

  clear() {
    this.#vertices = [];
    this.#updatePosition();
  }

  sceneElement() {
    return this.#particles;
  }

  loop(dt, t) {
  }
}
