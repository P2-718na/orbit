import * as THREE from 'three';

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

const geometry = new THREE.BufferGeometry();
let vertices = [];

for ( let i = 0; i < 10000; i ++ ) {

  const x = 50 * Math.random() - 25;
  const y = Math.random();
  const z = 50*Math.random() -25;

  vertices.push( x, y, z );

}

geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false, alphaTest: 0.5, transparent: true } );
material.color.setRGB( 230, 230, 255);

const particles = new THREE.Points( geometry, material );
scene.add( particles );

function render() {
  requestAnimationFrame( render );

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update( delta );

  //cube.rotation.y += 0.05;

  renderer.render( scene, camera );


  // Move particles:
  vertices = vertices.map((e, i) => {
    if ((i + 2) % 3 === 0) {
      const nextPos = (e - 0.1 * delta)
      return nextPos < 0 ? nextPos + 1 : nextPos; //todo do this with a modulo pls
    }

    return e
  })

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
}
render();


