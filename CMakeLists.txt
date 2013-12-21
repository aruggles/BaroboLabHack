# BaroboLab
# Barobo, Inc.

cmake_minimum_required(VERSION 2.8.9)

project(BAROBOLAB)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt5Core)
#find_package(Qt5Widgets)

find_path(BAROBO_INC mobot.h HINTS ${LIBBAROBO_INCLUDE_DIRS})
include_directories(${BAROBO_INC})
if(TARGET barobo)
  set(BAROBO barobo)
else()
  find_library(BAROBO barobo)
endif()

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

##############################################################################
# Targets

set(TARGET fancybrowser)

qt5_add_resources(RESOURCES jquery.qrc)

set(SOURCES main.cpp mainwindow.cpp jsinterface.cpp)

add_executable(${TARGET} ${SOURCES} ${RESOURCES})
target_link_libraries(${TARGET} ${BAROBO})
qt5_use_modules(${TARGET} Widgets Network WebKitWidgets)

install(TARGETS ${TARGET} RUNTIME DESTINATION bin)
install(DIRECTORY html DESTINATION share/BaroboLabHack)

