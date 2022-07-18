import * as THREE from 'three';
import Cloudchamber from "./scene-elements/cloudchamber/cloudchamber.js"
import Attractor from "./scene-elements/attractor/attractor";
import Projector4 from "./4d-projector/4d-projector";

import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

const width  = window.innerWidth;
const height = window.innerHeight;
const clock = new THREE.Clock();
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, width / height, 0.01, 1000 );

// This is required otherwise camera-controls don't work
camera.position.set(0, 0, 5);

const cameraControls = new CameraControls( camera, renderer.domElement );

const gridHelper = new THREE.GridHelper( 50, 10 );
gridHelper.position.y = 0;
scene.add(gridHelper);

/*
const cc = new Cloudchamber(50,
  3E4,
  {
    pointCloudParameters: require("../config/point-cloud.json"),
    vertexSpeed: 0.1,
  });

scene.add(cc.sceneElement());


const la = new Attractor(
  [-1, 5, 1],
  { sigma: 10, rho: 28, beta: 8 / 3 },
  5E4,
  {
    pointTrailParameters: require("../config/point-trail-blue.json"),
    plotSpeed: 0.1,
  });

const lb = new Attractor(
  [-1.1, 5.1, 1.1],
  { sigma: 10, rho: 28, beta: 8 / 3 },
  5E4,
  {
    pointTrailParameters: require("../config/point-trail-crimson.json"),
    plotSpeed: 0.1,
  });

scene.add(la.sceneElement());
scene.add(lb.sceneElement());
*/

const proj = new Projector4();
scene.add(proj.sceneElement());

const arr = proj.project3(new THREE.Vector4(1, 1, 0, 0))
const orig = proj.project3(new THREE.Vector4(0, 0, 0, 1))
const len = arr.length()
const arrowHelper = new THREE.ArrowHelper(arr.normalize(), orig, len, 0x00ffff);
scene.add(arrowHelper);

/*
const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
  -1.0, -1.0,  1.0,
  1.0, -1.0,  1.0,
  1.0,  1.0,  2.0,

  1.0,  1.0,  2.0,
  -1.0,  1.0,  1.0,
  -1.0, -1.0,  1.0
] );

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh)
*/

import { Buffer } from 'buffer';
global.Buffer = Buffer;
const implicitMesh = require('implicit-mesh');
/* This stuff adds some vulns */
const { positions, cells } = implicitMesh(64, function (x,y,z) {
  return x*x + y*y +z - 0.2;
});

console.log(cells)
console.log(positions)
// Correctly parse simplicial mesh
const vertices = new Float32Array(
  cells.reduce((acc, [x, y, z]) => {
    acc.push(...positions[x], ...positions[y], ...positions[z]);

    return acc;
  }, [])
)
console.log(vertices)

//console.log(implicitMesh(64, function (x,y,z,w) {
//  return x*x + y*y + z*z  + w*w - 0.2;
//}))
//console.log(vertices)

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0x99ff99 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh)

//todo create parser for simplicial complex stuff diocane


function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  // cc.loop(delta);
  //la.loop(delta); // todo this really needs to be implemented via event system...
  //lb.loop(delta)

  renderer.render(scene, camera);
}
render();


