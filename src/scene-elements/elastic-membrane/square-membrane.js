import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import * as THREE from "three";
import {Vector3} from "three";

const { PI, pow, sqrt, sin, cos } = Math;

const norm = ([a, b]) => sqrt(pow(a, 2) + pow(b, 2));

export default class SquareMembrane {
  // private ////////////////////////////////////////////////
  #a1;
  #a2;
  #T;
  #sigma;
  #s0;
  #v;
  #slices = 12;
  #stacks = 12;

  #waves = [];

  // THREE.js stuff
  #geometry;
  #material;
  #mesh;

  #oscillationEquation = (x, z, t) => {
    return this.#waves
      .reduce((acc, { k1, k2, w, A }) => {
        return acc + 4 * A * sin(k1 * x) * sin(k2 * z) * sin(w * t);
      }, 0);
  }

  #calcKn = (n, a) => {
    return n * PI / a;
  }

  // public /////////////////////////////////////////////////
  constructor(width = 1, height = 1, tension = 1, surfaceMassDensity = 1, amplitude) {
    this.#a1 = width;
    this.#a2 = height;
    this.#T = tension;
    this.#sigma = surfaceMassDensity;
    this.#s0 = amplitude;
    this.#v = sqrt(this.#T / this.#sigma);

    this.#geometry = new ParametricGeometry(this.getParametricEquation(1), this.#slices, this.#stacks);
    this.#material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    this.#mesh = new THREE.Mesh(this.#geometry, this.#material);
    this.#mesh.material.side = THREE.BackSide;
  }

  // Generate parametric surface function for a set time. (Compatible with THREE.js ParametricGeometry).
  getParametricEquation(time) {
    return (u, v, Vec3) => {
      const x = u * this.#a1;
      const z = v * this.#a2;

      Vec3.set(x, this.#oscillationEquation(x, z, time), z)
    }
  }

  // Set normal mode of oscillation
  setNormalModes(modes) {
    this.#waves = modes
      .map(({ n1, n2, A }) => {
        const k1 = this.#calcKn(n1, this.#a1);
        const k2 = this.#calcKn(n2, this.#a2);
        const k = norm([k1, k2]);
        const w = k * this.#v;

        return {
          k1,
          k2,
          w,
          A: A ?? this.#s0,
        };
      })
  }


  sceneElement() {
    return this.#mesh;
  }

  loop(dt, t) {
    this.#geometry = new ParametricGeometry(this.getParametricEquation(t), this.#slices, this.#stacks);
    this.#mesh.geometry = this.#geometry;
  }
}
