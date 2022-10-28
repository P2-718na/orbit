import * as THREE from "three";
import LaserBeam from "../../src/scene-elements/laser/laser.js";
import SquareMembrane from "../../src/scene-elements/elastic-membrane/square-membrane";
import setupDefaultScene from "../../src/utils/setup-default-scene";
import PointTrail from "../../src/scene-elements/point-trail/point-trail";

import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
import {Vector3} from "three";

const { scene, clock, renderer, camera, cameraControls } = setupDefaultScene(THREE);


const membrane = new SquareMembrane(5, 5, 100, 1, .005);



var Ambient, sunLight;

//Mouse evnet
var mouse = {
  x: 0,
  y: 0
}
document.addEventListener('mousemove', function(event) {
  mouse.x = (event.clientX / window.innerWidth) - 0.5
  mouse.y = (event.clientY / window.innerHeight) - 0.5
}, false);


//AmbientLight
Ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(Ambient);

//DirectionalLight
sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(5, 2, -10);
scene.add(sunLight);

//All object
var Geometry, Material;
var objectArray = [];

Geometry = new THREE.BoxGeometry(2, .1, 2);
Material = new THREE.MeshPhongMaterial({
  color: 0x00ff00
});

var Mash = new THREE.Mesh(Geometry, Material);
Mash.position.set(
  0,
  0,
  0
);
//objectArray.push(Mash);
objectArray.push(membrane.sceneElement());
//scene.add(Mash);

const trail = new PointTrail(require("../../config/point-trail-cyan.json"), 500);
scene.add(trail.sceneElement())

const Screen = new THREE.BoxGeometry(.2, 20, 20);
const screen = new THREE.Mesh(Screen, Material);
screen.position.set(
  -10,
  5,
  0
);
objectArray.push(screen);
scene.add(screen);

const LaserBeam1 = new LaserBeam({
  reflectMax: 1,
  length: 100,
});
add2Scene(LaserBeam1);

const laserRotation = new THREE.Spherical(1, 4, 3.14/ 2);

function add2Scene(obj) {
  scene.add(obj.object3d);
  scene.add(obj.pointLight);

  if (obj.reflectObject != null) {
    add2Scene(obj.reflectObject);
  }
}

document.onkeydown = (e) => {
  e = e || new Event();
  const { key } = e;

  switch (key) {
    case "h":
      LaserBeam1.object3d.position.x -= .1;
      break;
    case "n":
      LaserBeam1.object3d.position.x += .1;
      break;
    case "i":
      LaserBeam1.object3d.position.y -= .1;
      break;
    case "k":
      LaserBeam1.object3d.position.y += .1;
      break;
    case "j":
      LaserBeam1.object3d.position.z -= .1;
      break;
    case "l":
      LaserBeam1.object3d.position.z += .1;
      break;
    case "w":
      laserRotation.phi -= .05;
      break;
    case "s":
      laserRotation.phi += .05;
      break;
    case "a":
      laserRotation.theta -= .05;
      break;
    case "d":
      laserRotation.theta += .05;
      break;
  }
};

LaserBeam1.object3d.position.set(10, 5, 0);

membrane.sceneElement().position.set(-4, 0, -4);
scene.add(membrane.sceneElement());
function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  membrane.loop(delta, elapsed)

  const laserLookAt = new THREE.Vector3();
  laserLookAt.setFromSpherical(laserRotation)
  LaserBeam1.intersect(
    laserLookAt,
    objectArray,
    trail
  );
  Mash.position.set(0, 0.1*Math.cos(elapsed), 0)
  Mash.rotation.set( 0.1*Math.cos(elapsed), 0, 0.1*Math.sin(elapsed))
  renderer.render(scene, camera);
}
render();

const updateNormalModes = () => {

  const normalModes = document.getElementById("normalModes")
    .value
    .split("\n")
    .map(e => e.split(" "))
    .map(([n1, n2, A]) => {return {n1, n2, A}})
    .filter(({n1, n2}) => n1 && n2)
  console.log(normalModes)

  membrane.setNormalModes(normalModes);

  trail.clear();
}

document.getElementById("normalModes").onchange = updateNormalModes;


