
export default class ODESolver {

  // Constants
  #dy_over_dt;
  #h;
  #integrator;

  // variables
  #y;
  #t;

  // Integrators
  #integrators = {
    euler: () => {
      const t = this.#t;
      const y = this.#y;
      const h = this.#h;

      const k1 =  this.#dy_over_dt(t, y);

      this.#t += h;
      this.#y += k1*h;

      return this.#y;
    },

    rk4: () => {
      const t = this.#t;
      const y = this.#y;
      const h = this.#h;
      const f = this.#dy_over_dt;
      const h_over_2 = h/2;

      const k1 = f(t, y);
      const k2 = f(t + h_over_2, y + h_over_2*k1);
      const k3 = f(t + h_over_2, y + h_over_2*k2);
      const k4 = f(t + h, y + h*k3);

      this.#t += h;
      this.#y += 0.16666666666666666 * h*(k1 + 2*k2 + 2*k3 + k4);

      return this.#y;
    }
  }

  constructor(functionDerivative, [initialPosition, initialTime], stepSize, integratorID = "euler") {
    this.#dy_over_dt = functionDerivative;
    this.#y = initialPosition;
    this.#t = initialTime ?? 0;
    this.#h = stepSize;
    this.step = this.#integrators[integratorID]
  }

  steps(stepCount) {
    while (stepCount --> 1) {
      this.step()
    }

    return this.step();
  }

  stepUntilTime(targetTime) {
    let result;

    while(targetTime --> this.#t) {
      result = this.step();
    }

    return result;
  }
}

/*
TEST:
import ODESolver from "../../src/ode-solver/ode-solver";

const f = (t, y) => Math.pow(Math.sin(t), 2) * y;

const solver = new ODESolver(f, [2, 0], .5, "rk4");

for (let i = 0; i !== 10; ++i) {
  console.log(solver.step());
}

console.log("ciao")



* */
