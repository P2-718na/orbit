const THREE = require("three");

// tysm https://2pha.com/blog/threejs-easy-round-circular-particles/
const createCircleTexture = (color, size) => {
  const matCanvas = document.createElement('canvas');
  matCanvas.width = matCanvas.height = size;
  const matContext = matCanvas.getContext('2d');
  // create texture object from canvas.
  const texture = new THREE.Texture(matCanvas);
  // Draw a circle
  const center = size / 2;
  matContext.beginPath();
  matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
  matContext.closePath();
  matContext.fillStyle = color;
  matContext.fill();
  // need to set needsUpdate
  texture.needsUpdate = true;
  // return a texture made from the canvas
  return texture;
}

module.exports = {
  size: 0.01,
  sizeAttenuation: true,
  alphaTest: .5,
  transparent: true,
  map: createCircleTexture('#aaaaaa', 3),
  depthWrite: false
  //alphaMap: new THREE.TextureLoader().load("../assets/textures/drop.png"),
};
