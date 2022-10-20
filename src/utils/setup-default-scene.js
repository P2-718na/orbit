import CameraControls from 'camera-controls';

export default (THREE) => {
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

  return { scene, clock, cameraControls, renderer, camera }
}
