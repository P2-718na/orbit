import * as THREE from "three";
import setupDefaultScene from "../../src/utils/setup-default-scene";
import DPCart from "../../src/scene-elements/double-pendulum-cart/double-pendulum-cart";

const { scene, clock, renderer, camera, cameraControls } = setupDefaultScene(THREE, false);

const cart = new DPCart({ equation: "fDampened" });
//const cart = new DPCart({ equation: "fBugged", m:2, eta:.3, M:10 });
scene.add(cart.sceneElement())


function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  cart.loop(delta, elapsed);


  renderer.render(scene, camera);
}
render();

/*
// Random carts all around...
function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
const carts = Array.from(new Array(50)).map(e => {
  console.log(1)
  const x = randInt(-80, 80);
  const y = randInt(-80, 80);
  const z = randInt(-80, 80);
  const theta = randInt(-20, 20);
  const l = randInt(1, 5);

  const cart = new DPCart({ equation: "fDampened", l, stepSize: 0.01, eta:.1 }, [], [x, y, z], [0, theta, 0]);
  scene.add(cart.sceneElement())

  return cart
})
// add in loop
//carts.forEach(cart => cart.loop(delta, elapsed));
*/
