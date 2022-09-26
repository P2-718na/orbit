const defaultVelocityField = (x, y, z) => {
  return [0, -.5*((1-y)**2), 0];
}

export default class Particle {

  #position;
  #velocityField;

  #initializeParameters = ({ position, velocityField }) => {
    this.#position     = position ?? [0, 0, 0];

    this.#velocityField = velocityField ?? defaultVelocityField;
  }

  constructor(position) {
  }
}
