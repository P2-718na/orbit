import * as THREE from 'three';
import Cloudchamber from "./cloudchamber/cloudchamber.js"
import Attractor from "./attractor/attractor";

import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

const width  = window.innerWidth;
const height = window.innerHeight;
const clock = new THREE.Clock();
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

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
    pointCloudParameters: require("../config/point-cloud-white.json"),
    vertexSpeed: 0.1,
  });

scene.add(cc.sceneElement());
*/

const la = new Attractor(
  [-5, 10, -5],
  { sigma: 28, rho: 10, beta: 8 / 3 },
  1E5,
  {
    pointCloudParameters: require("../config/point-cloud-white.json"),
    plotSpeed: 0.1,
  });

scene.add(la.sceneElement());


function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  // cc.loop(delta);
  la.loop(delta);

  renderer.render(scene, camera);
}
render();


