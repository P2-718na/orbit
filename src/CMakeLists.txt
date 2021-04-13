ADD_EXECUTABLE(Lab5 main.cpp)

ADD_SUBDIRECTORY(Orbit)

TARGET_LINK_LIBRARIES(Lab5 Orbit)
TARGET_LINK_LIBRARIES(Lab5 sfml-graphics sfml-window sfml-audio)