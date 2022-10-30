
// sumStates member-by-member
const ss = (stateA, stateB) => {
  // assert Object.keys(stateA) === Object.keys(stateB)

  return Object.entries(stateA)
    .reduce((acc, [variableName, valueA]) => {
      acc[variableName] = valueA + stateB[variableName];

      return acc;
    }, {})
}

// multiplyState member-by-member
const ms = (scalar, state) => {
  return Object.entries(state)
    .reduce((acc, [variableName, value]) => {
      acc[variableName] = scalar * value;

      return acc;
    }, {})
}

export default class ODESolver {
  // Constants
  #evolutionLaw;
  #dt;

  // variables
  #state; // This represents the current system state (object).
  #t;

  // Integrators
  #integrators = {
    euler: () => {
      const t = this.#t;
      const y = this.#state;
      const dt = this.#dt;

      const dstate_over_dt =  this.#evolutionLaw(t, y);

      this.#t += dt;
      this.#state = ss(this.#state, ms(dt, dstate_over_dt));

      return this.#state;
    },

    rk4: () => {
      const t = this.#t;

      const y = this.#state; // Bear in mind that h is a number, while state is an object...
      const h = this.#dt;

      const f = this.#evolutionLaw;

      // Bear in mind that all the k coefficients are states...
      // Also, it appears operator overloading does not exist in javascript... Like, wtf?
      const k1 = f(t      , y);
      const k2 = f(t + h/2, ss(y, ms(h/2, k1)));
      const k3 = f(t + h/2, ss(y, ms(h/2, k2)));
      const k4 = f(t + h  , ss(y, ms(h  , k3)));

      const k2_2 = ms(2, k2);
      const k3_2 = ms(2, k3);
      const k2k3 = ss(k2_2, k3_2);
      const k1k4 = ss(k1, k4);
      const rkMagic = ss(k1k4, k2k3);

      this.#t += h;
      this.#state = ss(this.#state, ms(.16666666666666666 * h, rkMagic));
      // https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods

      return this.#state;
    }
  }

  // Bear in mind that evolutionLaw should be a funciton that returns a dState (state where components are their derivative)
  // Also, IMPORTANT: f SHOULD NOT EDIT THE ORIGINAL STATE OBJECT!
  constructor(evolutionLaw, [initialState, initialTime], stepSize, integratorName = "euler") {
    this.#evolutionLaw = evolutionLaw;
    this.#state = initialState;
    this.#t = initialTime ?? 0;

    this.#dt = stepSize;
    this.step = this.#integrators[integratorName]

    // Note to self: ATG uses the same technique to integrate a whole system. He integrates every quantity
    // separately, so I guess I can do the same without too many problems
    // (See: https://github.com/ange-yaghi/simple-2d-constraint-solver/blob/master/src/rk4_ode_solver.cpp)
  }

  step() {}

  steps(stepCount) {
    while (stepCount --> 1) {
      this.step()
    }

    return this.step();
  }

  stepUntilTime(targetTime) {
    let result;

    while(targetTime > this.#t) {
      result = this.step();
    }

    return result;
  }

  skipToTime(targetTime) {
    this.#t = targetTime;
  }
}

/*
TEST:
import ODESolver from "../../src/ode-solver/ode-solver";

const f = (t, {y}) => {return {y: Math.pow(Math.sin(t), 2) * y}};
const solver = new ODESolver(f, [{y:2}, 0], .5, "rk4");

for (let i = 0; i !== 10; ++i) {
  console.log(solver.step());
}

console.log("ciao")
* */

// https://www.reddit.com/r/math/comments/24tcb8/applying_the_rungekutta_method_to_the/
// https://www.myphysicslab.com/pendulum/cart-pendulum-en.html
/*
* Per poter usare Runge Kutta, le equazioni devono essere nella forma:
* x'' = f(x, x', \theta, \theta'),
* stessa cosa per \theta''.
* */
// E qui spiega come fare:
// https://pastebin.com/8Nbp2zC0
