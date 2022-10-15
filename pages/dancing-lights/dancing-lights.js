import * as THREE from "three";

import Laser from "three-laser-pointer"
import CameraControls from 'camera-controls';
import {cos} from "three/examples/jsm/nodes/ShaderNode";
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
//scene.add(gridHelper);



const laser = new Laser({
    color: 0xffffff,
    // maxPoints: 100*1000,
});
scene.add(laser);

const geometry = new THREE.PlaneGeometry( 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );


laser.setSource(new THREE.Vector3(1, 1, 1));
const pt = new THREE.Vector3(-1, -1, -1); // the target point to shoot

function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

    const meshes = [];

    plane.position.set(0, 0, .5*Math.cos(elapsed))
  laser.pointWithRaytrace(pt, meshes);

  renderer.render(scene, camera);
}
render();


