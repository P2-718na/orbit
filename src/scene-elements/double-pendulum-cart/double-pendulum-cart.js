import * as THREE from "three";
import ODESolver from "../../ode-solver/ode-solver";

const { sin, cos, PI:pi, pow } = Math;
const cos2 = x =>  cos(x) ** 2;
const sin2 = x =>  sin(x) ** 2;
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

export default class DPCart {
  // private ////////////////////////////////////////////////
  #mesh = new THREE.Group();
  #solver

  // Simulation state and parameters
  #time = 0;
  #state = {
    q     : .3,
    dot_q : 0,
    theta1    : .6,
    dot_theta1: 0,
    theta2    : .2,
    dot_theta2: 0
  };
  #parameters = {
    m         : 5,
    M         : 10,
    g         : 9.8,
    l         : 3,
    eta         : .6,
    stepSize  : .0001,
    integrator: "rk4",
    equation  : "fDampened"
  };

  // Scene elements
  #geometries = {};
  #materials  = {};
  #elements   = {};

  // Helper functions
  #updateObjectPositions() {
    const { q, theta1, theta2 } = this.#state;
    const { l } = this.#parameters;

    const tf = 3/5;

    Object.entries({
      support: [q                        , l                  , 0  ],
      ball1  : [-l*tf + q + l*sin(theta1), l*(1 - cos(theta1)), 0  ],
      ball2  : [ l*tf + q + l*sin(theta2), l*(1 - cos(theta2)), 0  ],
      string1: [-l*tf + q                , l                  , 0  ],
      string2: [ l*tf + q                , l                  , 0  ],
      arc0   : [0                        , l*6/5              , .25],
      arc1   : [-l*tf + q                , l                  , .25],
      arc2   : [ l*tf + q                , l                  , .25],
      normal0: [q                        , l*tf               , 0  ],
      normal1: [-l*tf + q                , 0                  , 0  ],
      normal2: [ l*tf + q                , 0                  , 0  ],
    }).forEach(([key, value]) => {
      this.#elements[key].position.set(...value);
    })
  }

  #getMesh(meshType, geometry, material) {
    return new THREE[meshType]((this.#geometries[geometry])(), this.#materials[material])
  }

  static #setArcGeometry(geometry, radius, startAngle, angleLength, divisions = 50) {
    const endAngle = angleLength + startAngle;
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, startAngle, endAngle, angleLength < 0);
    const points = curve.getPoints(divisions);

    geometry.setFromPoints(points);
  }

  #getMotionEquations = () => require("./forces.js")(this.#parameters);

  // Setup functions
  #setupScene() {
    const { l } = this.#parameters;
    const ballRadius = .2;

    // Geometries that require points are built in respect to the origin, and their position and
    // rotation is updated later...
    // Note that these are functions, since we may not want duplicate gometries... (For arc, we NEED different geoms).
    this.#geometries = {
      cartGeometry   : () => new THREE.BoxGeometry(12/5 * l, .1, 1, 4),
      ballGeometry   : () => new THREE.SphereGeometry(ballRadius, 12, 12),
      stringGeometry : () => new THREE.BufferGeometry().setFromPoints([
        v3(0, 0, 0),
        v3(0, ballRadius-l, 0)
      ]),
      normalGeometry: () => new THREE.BufferGeometry().setFromPoints([
        v3(0, -l/5, 0),
        v3(0, l, 0)
      ]),
      arcGeometry    : () => new THREE.BufferGeometry()
    }

    this.#materials = {
      solidMaterial  : new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe:true }),
      lineMaterial   : new THREE.LineBasicMaterial({ color: 0xffffff }),
      normalMaterial: new THREE.LineDashedMaterial({
        color: 0x555555,
        dashSize: .3,
        gapSize: .15
      })
    }

    this.#elements = Object.entries({
        support: ["Mesh", "cartGeometry"  , "solidMaterial" ],
        ball1  : ["Mesh", "ballGeometry"  , "solidMaterial" ],
        ball2  : ["Mesh", "ballGeometry"  , "solidMaterial" ],
        string1: ["Line", "stringGeometry", "lineMaterial"  ],
        string2: ["Line", "stringGeometry", "lineMaterial"  ],
        arc0   : ["Line", "arcGeometry"   , "lineMaterial"  ],
        arc1   : ["Line", "arcGeometry"   , "lineMaterial"  ],
        arc2   : ["Line", "arcGeometry"   , "lineMaterial"  ],
        normal0: ["Line", "normalGeometry", "normalMaterial"],
        normal1: ["Line", "normalGeometry", "normalMaterial"],
        normal2: ["Line", "normalGeometry", "normalMaterial"]
      })
        .reduce((acc, [key, value]) => {
          acc[key] = this.#getMesh(...value);
          return acc;
        }, {});


    this.#updateObjectPositions();

    // Needed for dotted lines to properly display
    this.#elements.normal0.computeLineDistances();
    this.#elements.normal1.computeLineDistances();
    this.#elements.normal2.computeLineDistances();

    // Create the final object to add to the scene
    this.#mesh.add(...Object.values(this.#elements));
  }

  #setupPhysics() {
    const { stepSize, integrator } = this.#parameters;
    this.#solver = new ODESolver(this.#getMotionEquations(), [this.#state, this.#time], stepSize, integrator)
  }

  // Loop functions
  #updateScene() {
    const { q, theta1, theta2 } = this.#state
    const { l } = this.#parameters;

    const { arc0, arc1, arc2, ball1, ball2, string1, string2 } = this.#elements
    arc0.geometry.setFromPoints([v3(0, 0, 0), v3(q, 0, 0)]);
    DPCart.#setArcGeometry(arc1.geometry, l*3/5, -pi/2, theta1);
    DPCart.#setArcGeometry(arc2.geometry, l*3/5, -pi/2, theta2);

    this.#updateObjectPositions();

    ball1.setRotationFromEuler(new THREE.Euler(0, 0, theta1));
    ball2.setRotationFromEuler(new THREE.Euler(0, 0, theta2));

    string1.setRotationFromEuler(new THREE.Euler(0, 0, theta1));
    string2.setRotationFromEuler(new THREE.Euler(0, 0, theta2));
  }

  #updatePhysics(t) {
    // Loop simulation until we reach current time...
    this.#state = this.#solver.stepUntilTime(t);
  }

// public ////////////////////////////////////////////////
  constructor(parameters = {}, [initialState, initialTime] = [], position, rotation) {
    this.#time     ??= initialTime;
    this.#state      = { ...this.#state     , ...initialState };
    this.#parameters = { ...this.#parameters, ...parameters   };

    this.#setupPhysics();
    this.#setupScene();

    position && this.#mesh.position.set(...position);
    rotation && this.#mesh.rotation.set(...rotation);
  }

  sceneElement() {
    return this.#mesh;
  }

  loop(dt, t) {
    // Don't update if dt too large...
    if (dt < 1) {
      this.#updatePhysics(t);
    } else {
      this.#solver.skipToTime(t);
    }

    this.#updateScene();
  }
}

// Random resources I used:
// https://12000.org/my_notes/cart_motion/report.htm#:~:text=To%20%EF%AC%81nd%20the%20equation%20of%20motion%20for%20we%20apply%20%CF%84,motion)%20where%20is%20the%20torque.&text=Therefore%20(6)%20%CE%B8%20%C2%A8%20%3D,required%20equation%20of%20motion%20for%20.
