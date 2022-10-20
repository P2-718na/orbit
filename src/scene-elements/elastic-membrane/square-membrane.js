import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import * as THREE from "three";
import {Vector3} from "three";

const { PI, pow, sqrt, sin, cos } = Math;

export default class SquareMembrane {
  // private ////////////////////////////////////////////////
  #a1;
  #a2;
  #T;
  #sigma;
  #s0;
  #v;
  #slices = 24;
  #stacks = 24;

  #k;
  #k1;
  #k2;
  #n1;
  #n2;

  // THREE.js stuff
  #geometry;
  #material;
  #mesh;

  #oscillationEquation = (x, z, t) => {
    const s0 = this.#s0;
    const k1 = this.#k1;
    const k2 = this.#k2;
    const w = this.#k * this.#v;

    return 4 * s0 * sin(k1 * x) * sin(k2 * z) * sin(w * t);  //+ 4 * s0 * sin(k1 * x) * sin(k2*3 * z) * sin(w*4 * t);
  }

  // public /////////////////////////////////////////////////
  constructor(width = 1, height = 1, tension = 1, surfaceMassDensity = 1, amplitude) {
    this.#a1 = width;
    this.#a2 = height;
    this.#T = tension;
    this.#sigma = surfaceMassDensity;
    this.#s0 = amplitude;
    this.#v = sqrt(this.#T / this.#sigma);

    this.setNormalMode(1, 1);

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
  setNormalMode(n1, n2) {
    this.#n1 = n1;
    this.#n2 = n2;

    this.#k1 = n1 * PI / this.#a1;
    this.#k2 = n2 * PI / this.#a2;

    this.#k = sqrt(pow(this.#k1, 2) + pow(this.#k2, 2));
  }


  sceneElement() {
    return this.#mesh;
  }

  loop(dt, t) {
    this.#geometry = new ParametricGeometry(this.getParametricEquation(t), this.#slices, this.#stacks);
    this.#mesh.geometry = this.#geometry;
  }
}