import * as THREE from 'three';
import Cloudchamber from "./scenes/cloudchamber/cloudchamber.js"
import Attractor from "./scenes/attractor/attractor";

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
    pointCloudParameters: require("../config/point-cloud-white.json"),
    vertexSpeed: 0.1,
  });

scene.add(cc.sceneElement());
*/

const la = new Attractor(
  [-1, 5, 1],
  { sigma: 10, rho: 28, beta: 8 / 3 },
  3E4,
  {
    pointTrailParameters: require("../config/point-cloud-white.json"),
    plotSpeed: 0.1,
  });

scene.add(la.sceneElement());


function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  // cc.loop(delta);
  la.loop(delta); // todo this really needs to be implemented via event system...

  renderer.render(scene, camera);
}
render();


