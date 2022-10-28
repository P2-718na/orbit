import * as THREE from "three";

export default class DPCart {
// private ////////////////////////////////////////////////
  #geometry;
  #material;
  #mesh;

  // Generalised coordinates
  #theta_1
  #theta_2
  #x

// public ////////////////////////////////////////////////
  constructor(startCoordinates, { sigma, rho, beta }, vertexCount = 1E5, { pointTrailParameters }) {


  sceneElement() {
    return this.#mesh;
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
