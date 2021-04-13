// Doctest requires this define to be specified only once.
// Probably this is the best place
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "../doctest.h"
#include "orbit.hpp"

TEST_CASE("Orbit test") {

  Orbit orbit{
    {1.470568E11, 0, 0, 30.28361E3},
    3.154E7
  };

  std::vector<State> points = orbit.generate_points(500000);

  CHECK(points.front().x == doctest::Approx(points.back().x).epsilon(0.01));
  CHECK(points.front().y == doctest::Approx(points.back().y).epsilon(0.01));
}