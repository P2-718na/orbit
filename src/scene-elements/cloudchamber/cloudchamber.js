import * as THREE from "three";
import project_vertexGlsl from "three/src/renderers/shaders/ShaderChunk/project_vertex.glsl";

const defaultVelocityField = (x, y, z) => {
  return [0, -.5*((1-y)**2), 0];
}

export default class Cloudchamber {
  // Private ////////////////////////////////////////////////
  #particles = new THREE.Points;
  #geometry  = new THREE.BufferGeometry;
  #material  = new THREE.PointsMaterial;
  #vertices;

  // Parameters ///////
  #chamberWidth;
  #chamberDepth;
  #vertexCount;
  #vertexMass
  #dampenFactor;
  #velocityField;

  // todo add randfloat function
  // Todo maybe add possibility to have more complex bounding box
  #randomX = () => this.#chamberWidth * Math.random() - this.#chamberWidth / 2;
  #randomY = () => Math.random() * this.#chamberDepth;
  #randomZ = () => this.#chamberWidth * Math.random() - this.#chamberWidth / 2;

  #initializeParameters = ({ chamberWidth, chamberDepth, vertexCount, velocityField }) => {
    this.#chamberWidth = chamberWidth ?? 50;
    this.#chamberDepth = chamberDepth ?? .1;
    this.#vertexCount  = vertexCount  ?? 1E4;

    this.#velocityField = velocityField ?? defaultVelocityField;
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

      const x = this.#randomX();
      const y = this.#randomY();
      const z = this.#randomZ();

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
    this.#vertices = this.#vertices.map((vertexComponent, vertexComponentIndex, vertices) => {
      const vertexIndex = Math.floor(vertexComponentIndex / 3);

      const [x, y, z]    = [0, 1, 2].map(i => vertices[vertexIndex * 3 + i])
      const [vx, vy, vz] = this.#velocityField(x, y, z);

      // Todo create appropriate wrap around functions if out of boundary
      // If this is a x component...
      if (vertexComponentIndex % 3 === 0) {
        const next = vertexComponent + (vx * dt);
        const boundary = this.#chamberWidth / 2;

        return (-boundary <= next && next <= boundary)? next : this.#randomX();
      }

      // If this is a y component...
      if (vertexComponentIndex % 3 === 1) {
        const next = vertexComponent + (vy * dt);

        return (0 <= next && next <= this.#chamberDepth)? next : this.#randomY();
      }

      // If this is a z component...
      if (vertexComponentIndex % 3 === 2) {
        const next = vertexComponent + (vz * dt);
        const boundary = this.#chamberWidth / 2;

        return (-boundary <= next && next <= boundary)? next : this.#randomZ();
      }
    }, this)

    this.#updatePosition()
  }
}
