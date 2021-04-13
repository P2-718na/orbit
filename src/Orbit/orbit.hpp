#pragma once
#include <vector>

struct State
{
  double x;
  double y;
  double vx;
  double vy;
};

class Orbit
{
  State initialState_;
  double durationInSeconds_;

 public:
  const static double GRAVITATIONAL_CONSTANT;
  const static double SOLAR_MASS;
  const static double K;

  Orbit(State const& initialState, double durationInSeconds);

  std::vector<State> generate_points(int pointCount) const;

  // Static
  static double calcAccX(double x, double y);
  static double calcAccY(double x, double y);
};
