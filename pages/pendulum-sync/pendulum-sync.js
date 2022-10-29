import * as THREE from "three";
import setupDefaultScene from "../../src/utils/setup-default-scene";
import DPCart from "../../src/scene-elements/double-pendulum-cart/double-pendulum-cart";

const { scene, clock, renderer, camera, cameraControls } = setupDefaultScene(THREE, false);

const cart = new DPCart();
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
