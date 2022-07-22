import * as THREE from "three";
import project_vertexGlsl from "three/src/renderers/shaders/ShaderChunk/project_vertex.glsl";

const defaultForceField = (x, y, z) => {
  return [0, 0, -.1];
}

export default class Cloudchamber {
  // Private ////////////////////////////////////////////////
  #particles;
  #geometry = new THREE.BufferGeometry;
  #material = new THREE.PointsMaterial;
  #vertices;
  #vertexVelocities;

  // Parameters ///////
  #chamberWidth;
  #chamberDepth;
  #vertexCount;
  #vertexMass
  #dampenFactor;
  #forceField;

  #initializeParameters = ({ chamberWidth, chamberDepth, vertexCount, vertexMass, dampenFactor, forceField }) => {
    this.#chamberWidth = chamberWidth ?? 50;
    this.#chamberDepth = chamberDepth ?? .1;
    this.#vertexCount  = vertexCount  ?? 1E4;
    this.#vertexMass   = vertexMass   ?? 1;
    this.#dampenFactor = dampenFactor ?? 9;

    this.#forceField = forceField ?? defaultForceField;
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
      const x = this.#chamberWidth * Math.random() - this.#chamberWidth / 2;
      const y = Math.random() * this.#chamberDepth;
      const z = this.#chamberWidth * Math.random() - this.#chamberWidth / 2;

      this.#vertices[3 * i]     = x;
      this.#vertices[3 * i + 1] = y;
      this.#vertices[3 * i + 2] = z;
    }
    // todo set initial random speeds
    this.#vertexVelocities = Array.from(new Array(this.#vertexCount).keys()).map(_ => [0, 0, 0]);

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
    //console.log(this.#vertices.slice(0, 10))
    //console.log(this.#vertexVelocities.slice(0, 10))
    this.#vertexVelocities = this.#vertexVelocities.map((vertexVelocity, vertexIndex) => {
      const [x, y, z] = [0, 1, 2].map(e => this.#vertices[(vertexIndex * 3) + e])

      const dv = [0, 1, 2].map(i => {
        return (this.#vertexMass * this.#forceField(x, y, z)[i] - this.#dampenFactor * vertexVelocity[i]) * dt
      })

      return vertexVelocity.map((vi, i) => vi + dv[i]);
    })

    this.#vertices = this.#vertices.map((vertexComponent, vertexComponentIndex, vertices) => {
      const vertexIndex = Math.floor(vertexComponentIndex / 3);

      let   [vx, vy, vz] = this.#vertexVelocities[vertexIndex];

      // If this is a x component...
      if (vertexComponentIndex % 3 === 0) {
        return vertexComponent + (vx * dt)
      }

      // If this is a y component...
      if (vertexComponentIndex % 3 === 1) {
        return vertexComponent + (vy * dt)
      }

      // If this is a z component...
      if (vertexComponentIndex % 3 === 2) {
        return vertexComponent + (vz * dt)
      }
    }, this)

    this.#updatePosition()
  }
}
