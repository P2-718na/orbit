import * as THREE from "three";
import {PI} from "three/examples/jsm/nodes/ShaderNode";
import ODESolver from "../../ode-solver/ode-solver";
import {calcNURBSDerivatives} from "three/examples/jsm/curves/NURBSUtils";
import {Vector3} from "three";

const { f, fattr, fattr2 } = require("./forces.js");

const { sin, cos, PI:pi, pow } = Math;
const cos2 = x =>  cos(x) ** 2;
const sin2 = x =>  sin(x) ** 2;

const m = 2;
const M = 10;
const g = 9.8;
const l = 5;
const η = .3;

const defaultState = {
  x    : .3,
  dotX : 0,
  t1   : 0,
  dotT1: 0,
  t2   : -.3,
  dotT2: 0
};

export default class DPCart {
// private ////////////////////////////////////////////////
  #mesh;
  #solver

  // Generalised coordinates
  #state;
  #l = 5;


  // Elements
  #support;
  #ball1;
  #ball2;
  #string1;
  #string2;
;
  #arc0;
  #arc1;
  #arc2;

  #textT1

  #normal0;
  #normal1;
  #normal2;

  // Functions

  static #setArcGeometry(geometry, radius, startAngle, angleLength, divisions = 50) {
    const endAngle = angleLength + startAngle;
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, startAngle, endAngle, angleLength < 0);
    const points = curve.getPoints(divisions);

    geometry.setFromPoints(points);
  }

// public ////////////////////////////////////////////////
  constructor(state = defaultState) {
    this.#state = state;
    this.#solver = new ODESolver(fattr, [state, 0], .0001, "rk4")

    const supportGeometry = new THREE.BoxGeometry(10, .1, 2, 4);
    const ballGeometry = new THREE.SphereGeometry(.2, 12, 12);

    const points = [
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, -4.8, 0 )
    ];
    const points2 = [
      new THREE.Vector3( 0, -1, 0 ),
      new THREE.Vector3( 0, 5, 0 )
    ];
    const stringGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const normalGeometry = new THREE.BufferGeometry().setFromPoints(points2);

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe:true });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const normalMaterial = new THREE.LineDashedMaterial( {
      color: 0x555555,
      dashSize: .3,
      gapSize: .15
    } );

    this.#support = new THREE.Mesh(supportGeometry, material);
    this.#ball1 = new THREE.Mesh(ballGeometry, material);
    this.#ball2 = new THREE.Mesh(ballGeometry, material);
    this.#string1 = new THREE.Line(stringGeometry, lineMaterial);
    this.#string2 = new THREE.Line(stringGeometry, lineMaterial);
    this.#normal0 = new THREE.Line(normalGeometry, normalMaterial);
    this.#normal1 = new THREE.Line(normalGeometry, normalMaterial);
    this.#normal2 = new THREE.Line(normalGeometry, normalMaterial);


    this.#mesh = new THREE.Group();
    this.#mesh.add(this.#support, this.#ball1, this.#ball2, this.#string1, this.#string2, this.#normal0, this.#normal1, this.#normal2);


    this.#support.position.set(0, 5, 0);
    this.#ball1.position.set(-2.5, 0, 0);
    this.#ball2.position.set(2.5, 0, 0);
    this.#string1.position.set(-2.5, 5, 0);
    this.#string2.position.set(2.5, 5, 0);
    this.#normal0.position.set(0, 3, 0);
    this.#normal1.position.set(-2.5, 0, 0);
    this.#normal2.position.set(2.5, 0, 0);

    this.#normal0.computeLineDistances();
    this.#normal1.computeLineDistances();
    this.#normal2.computeLineDistances();

    // Create the final object to add to the scene
    this.#arc0 = new THREE.Line(  new THREE.BufferGeometry(), lineMaterial );
    this.#arc1 = new THREE.Line(  new THREE.BufferGeometry(), lineMaterial );
    this.#arc2 = new THREE.Line(  new THREE.BufferGeometry(), lineMaterial );
    this.#mesh.add(this.#arc0, this.#arc1, this.#arc2);

    this.#arc0.position.set(0, 6, .5);
  }

  sceneElement() {
    return this.#mesh;
  }

  loop(dt, t) {
    this.#state = this.#solver.stepUntilTime(t);

    const { x, t1, t2 } = this.#state

    this.#arc0.geometry.setFromPoints([new Vector3(0, 0, 0), new Vector3(x, 0, 0)]);
    DPCart.#setArcGeometry(this.#arc1.geometry, 3, -pi/2, t1);
    DPCart.#setArcGeometry(this.#arc2.geometry, 3, -pi/2, t2);
    this.#arc1.position.set(-2.5 + x, 5, .5);
    this.#arc2.position.set(2.5 + x, 5, .5);
    //console.log(dotX, x);
    const l = this.#l

    this.#support.position.set(x, 5, 0);

    this.#ball1.position.set(-2.5 + x + l*sin(t1), l*(1-cos(t1)), 0);
    this.#ball2.position.set(2.5 + x + l*sin(t2), l*(1-cos(t2)), 0);
    this.#ball1.setRotationFromEuler(new THREE.Euler(0, 0, t1));
    this.#ball2.setRotationFromEuler(new THREE.Euler(0, 0, t2));

    this.#string1.setRotationFromEuler(new THREE.Euler(0, 0, t1));
    this.#string2.setRotationFromEuler(new THREE.Euler(0, 0, t2));

    this.#string1.position.set(-2.5 + x, 5, 0);
    this.#string2.position.set(2.5 + x, 5, 0);

    this.#normal1.position.set(-2.5 + x, 0, 0);
    this.#normal2.position.set(2.5 + x, 0, 0);
  }
}
calcNURBSDerivatives

// Random resources I used:
// https://12000.org/my_notes/cart_motion/report.htm#:~:text=To%20%EF%AC%81nd%20the%20equation%20of%20motion%20for%20we%20apply%20%CF%84,motion)%20where%20is%20the%20torque.&text=Therefore%20(6)%20%CE%B8%20%C2%A8%20%3D,required%20equation%20of%20motion%20for%20.
