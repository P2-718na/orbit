#include "orbit.hpp"

#include <cmath>

//                              10 ** -11
const double Orbit::GRAVITATIONAL_CONSTANT = 6.674E-11;
//                              10 ** 30
const double Orbit::SOLAR_MASS = 1.989E30;
const double Orbit::K = Orbit::SOLAR_MASS * Orbit::GRAVITATIONAL_CONSTANT;

Orbit::Orbit(const State& initialState, double durationInSeconds)
  : initialState_{initialState}
  , durationInSeconds_{durationInSeconds}
{}

std::vector<State> Orbit::generate_points(int pointCount) const {
  std::vector<State> states;

  // Reserve space
  states.reserve(pointCount);

  // dt used for calculations
  double dt = durationInSeconds_ / (pointCount+1);

  // Current state
  State cs = initialState_;

  // Initial state is not pushed into array
  //states.push_back(initialState_);
  for (int i = 0; i < pointCount; ++i) {

    const double ax = calcAccX(cs.x, cs.y);
    const double ay = calcAccY(cs.x, cs.y);

    cs.vx += ax * dt;
    cs.vy += ay * dt;

    cs.x += cs.vx * dt;
    cs.y += cs.vy * dt;

    states.push_back(cs);
  }

  return states;
}
double Orbit::calcAccX(double x, double y) {
  return -K * x / pow(x*x + y*y, 3.f/2.f);
}

double Orbit::calcAccY(double x, double y) {
  return -K * y / pow(x*x + y*y, 3.f/2.f);
}
