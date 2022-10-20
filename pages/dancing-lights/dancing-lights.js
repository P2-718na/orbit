import * as THREE from "three";
import LaserBeam from "../../src/scene-elements/laser/laser.js";
const implicitMesh = require('implicit-mesh');
import setupDefaultScene from "../../src/utils/setup-default-scene";

import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

const { scene, clock, renderer, camera, cameraControls } = setupDefaultScene(THREE);

const generateMembrane = (width, t) => {
  return (u, v, vec3) => {
    const x = u * width - 5;
    const z = v * width - 5;
    const r = 2;
    const n = 3;
    const h = 2;
    const k = Math.PI*n/(r * r + h * h)
    const w = 1;
     //vec3.set(x, 4 * Math.sin(x) * Math.sin(z) * Math.sin(t), z);
    vec3.set(x, 1*2*h*Math.sin(k * Math.sqrt(x*x + z*z + h*h))*Math.cos(w * n * t) / Math.pow((x*x + z * z + h * h), 2), z);
  }
}

const membrane = generateMembrane(10, 0);
const geometry = new ParametricGeometry(membrane, 64, 64);
const material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
const mesh = new THREE.Mesh( geometry, material );
mesh.material.side = THREE.BackSide;
//mesh.position.set(-5, 0, -5)
mesh.position.set(0, 0, 0)
scene.add(mesh)

var Ambient, sunLight;
var LaserBeam1;

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

var LaserBeam1 = new LaserBeam({
  reflectMax: 1,
  length: 100,
});
add2Scene(LaserBeam1);

function add2Scene(obj) {
  scene.add(obj.object3d);
  scene.add(obj.pointLight);

  if (obj.reflectObject != null) {
    add2Scene(obj.reflectObject);
  }
}

document.onkeydown = (e) => {
  e = e || new Event();
  const { keyCode } = e;

  switch (keyCode) {
    case 65:
      LaserBeam1.object3d.position.z -= .5;
      break;
    case 68:
      LaserBeam1.object3d.position.z += .5;
      break;
    case 83:
      LaserBeam1.object3d.position.x -= .5;
      break;
    case 87:
      LaserBeam1.object3d.position.x += .5;
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


  LaserBeam1.intersect(
    new THREE.Vector3(-1, -.5, 0),
    objectArray
  );
  Mash.position.set(0, 0.1*Math.cos(elapsed), 0)
  Mash.rotation.set( 0.1*Math.cos(elapsed), 0, 0.1*Math.sin(elapsed))
  renderer.render(scene, camera);
}
render();


