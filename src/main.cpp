#include <SFML/Graphics.hpp>
#include <limits>
#include <cstdlib>
#include "orbit.hpp"

struct Boundaries {
  double maxX{-std::numeric_limits<double>::max()};
  double minX{std::numeric_limits<double>::max()};
  double maxY{-std::numeric_limits<double>::max()};
  double minY{std::numeric_limits<double>::max()};
};

Boundaries getBoundaries(const std::vector<State> &points) {
  Boundaries boundary{};

  for (auto &point : points) {
    if (point.x > boundary.maxX) {
      boundary.maxX = point.x;
    }

    if (point.x < boundary.minX) {
      boundary.minX = point.x;
    }

    if (point.y > boundary.maxY) {
      boundary.maxY = point.y;
    }

    if (point.y < boundary.minY) {
      boundary.minY = point.y;
    }
  }

  return boundary;
}

void print(const std::vector<State> &points) {
  printf("Printing %lu points...\n", points.size());

  for (auto &point : points) {
    printf("x: %.3e, y: %.3e\n", point.x, point.y);
  }
}

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 800), "orbit");

  Orbit orbit{{1.470568E11, 0, 0, 30.28361E3}, 3.156e+7};

  //Todo
  sf::VertexArray vertex(sf::Points, 50000);
  std::vector<State> points = orbit.generate_points(50000);

  Boundaries boundaries = getBoundaries(points);

  const double scaleX = (boundaries.maxX - boundaries.minX) / 800;
  const double scaleY = (boundaries.maxY - boundaries.minY) / 800;
  // We don't want orbit to be displayed as circular
  const double scale = (scaleX > scaleY) ? scaleX : scaleY;

  const double traslX = (800 - boundaries.maxX / scaleX) / 2;
  const double traslY = (800 - boundaries.maxY / scaleY) / 2;

  for (int i = 0; i < points.size(); ++i) {
    const auto viewportX = (float)((points[i].x - boundaries.minX) / scale);//+ traslX);
    const auto viewportY = (float)((points[i].y - boundaries.minY) / scale);//+ traslY);

    // Set color and position of vertex
    vertex[i].position = {viewportX, viewportY};
    vertex[i].color = sf::Color::Red;
  }

  //// Print points
  print(points);

  while (window.isOpen()) {
    sf::Event event{};
    while (window.pollEvent(event)) {
      if (event.type == sf::Event::Closed) {
        window.close();
      }
    }

    window.clear();
    window.draw(vertex);
    window.display();
  }
}
