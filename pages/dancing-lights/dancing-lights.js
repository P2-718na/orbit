import * as THREE from "three";
import LaserBeam from "../../src/scene-elements/laser/laser.js";
const implicitMesh = require('implicit-mesh');
import setupDefaultScene from "../../src/utils/setup-default-scene";

import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

const { scene, clock, renderer, camera, cameraControls } = setupDefaultScene(THREE);

const generateMembrane = (width, t) => {
  return (u, v, vec3) => {
    const x = u * width;
    const z = v * width;

    vec3.set(x, .1 * Math.sin(x) * Math.sin(z) * Math.sin(t), z);
  }
}

const membrane = generateMembrane(10, 0);
const geometry = new ParametricGeometry(membrane, 128, 128);
const material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
const mesh = new THREE.Mesh( geometry, material );
mesh.material.side = THREE.BackSide;
mesh.position.set(-5, 0, -5)
//mesh.position.set(0, 0, 0)
scene.add(mesh)

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
objectArray.push(mesh);
//scene.add(Mash);

const Screen = new THREE.BoxGeometry(.2, 20, 20);
var screen = new THREE.Mesh(Screen, Material);
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
      laserRotation.phi -= .1;
      break;
    case "s":
      laserRotation.phi += .1;
      break;
    case "a":
      laserRotation.theta -= .1;
      break;
    case "d":
      laserRotation.theta += .1;
      break;
  }
};

LaserBeam1.object3d.position.set(10, 5, 0);

function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  const membrane = generateMembrane(10, elapsed);
  const geometry = new ParametricGeometry(membrane, 32, 32);
  mesh.geometry = geometry;

  const laserLookAt = new THREE.Vector3();
  laserLookAt.setFromSpherical(laserRotation)
  LaserBeam1.intersect(
    laserLookAt,
    objectArray
  );
  Mash.position.set(0, 0.1*Math.cos(elapsed), 0)
  Mash.rotation.set( 0.1*Math.cos(elapsed), 0, 0.1*Math.sin(elapsed))
  renderer.render(scene, camera);
}
render();


