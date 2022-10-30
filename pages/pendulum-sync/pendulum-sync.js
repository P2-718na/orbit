import * as THREE from "three";
import setupDefaultScene from "../../src/utils/setup-default-scene";
import DPCart from "../../src/scene-elements/double-pendulum-cart/double-pendulum-cart";

const { scene, clock, renderer, camera, cameraControls } = setupDefaultScene(THREE, false);

const cart = new DPCart({ equation: "fConservative" });
scene.add(cart.sceneElement())

const cart1 = new DPCart({ equation: "fDampened" }, [], [0, 10, 0], [0, 1.5, 0]);
scene.add(cart1.sceneElement())


function render() {
  requestAnimationFrame(render);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const updated = cameraControls.update(delta);

  cart.loop(delta, elapsed);
  cart1.loop(delta, elapsed);

  renderer.render(scene, camera);
}
render();
