import * as THREE from "three";

export default class Attractor {
// private ////////////////////////////////////////////////
  #vertices = [];
  #particles;
  #vertexCount;

  #sigma;
  #rho;
  #beta;

  #updatePosition() {
    this.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        this.#vertices, 3
      )
    );
  }

  #nextPosition(dt) {
    const [x, y, z] = this.#vertices.slice(-3);

    const d = [
      this.#sigma * (y - x),
      x * (this.#rho - z) - y,
      x * y - this.#beta * z
    ];

    return [x, y, z].map((e, i) => e + d[i] * dt) // cleanme this is a bit ugly
  }

// public ////////////////////////////////////////////////
  constructor(startCoordinates, { sigma, rho, beta }, vertexCount = 1E5, { pointTrailParameters }) {
    this.geometry = new THREE.BufferGeometry();

    // No need to set initial vertex position for each vertex. Just memorize this value
    // to avoid excessive lag.
    this.#vertices.push(...startCoordinates);
    this.#vertexCount = vertexCount

    // Set parameters
    this.#sigma = sigma;
    this.#rho = rho;
    this.#beta = beta;

    this.#updatePosition();

    // Generate material from configuration
    this.material = new THREE.PointsMaterial(
      pointTrailParameters
    );

    this.material.color.setRGB(200, 200, 255); // todo maybe move this in config json if possible?

    this.#particles = new THREE.Points(this.geometry, this.material);
    this.#particles.frustumCulled = false // fix disappearing particles when too close
  }

  sceneElement() {
    return this.#particles;
  }

  loop(dt) {
    // Shift all forward by one position and push new position at the end
    while (this.#vertices.length > this.#vertexCount) {
      this.#vertices.shift(); // cleanme pls
      this.#vertices.shift();
      this.#vertices.shift();
    }

    // todo dt needs to be smaller. Run nextPosition a lot then push all the pixels
    //  this dt needs to be variable depending on the distance of the last two points... Need more complex logic here
    for (let i = 0; i !== 50; ++i) {
      this.#vertices.push(...this.#nextPosition(dt / 10))
      this.#updatePosition() // fixme questo è un po' sus, se lo tolgo dal for non si comporta come mi aspetto.
    }
  }
}
