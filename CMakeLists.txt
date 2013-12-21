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

include(CPack)
include(InstallRequiredSystemLibraries)
SET(CPACK_PACKAGE_DESCRIPTION_SUMMARY "BaroboLab")
SET(CPACK_PACKAGE_VENDOR "Barobo, inc.")
#SET(CPACK_PACKAGE_DESCRIPTION_FILE "${CMAKE_CURRENT_SOURCE_DIR}/ReadMe.txt")
#SET(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/Copyright.txt")
#SET(CPACK_PACKAGE_VERSION_MAJOR "1")
#SET(CPACK_PACKAGE_VERSION_MINOR "3")
#SET(CPACK_PACKAGE_VERSION_PATCH "2")
SET(CPACK_PACKAGE_INSTALL_DIRECTORY "BaroboLab")
IF(WIN32 AND NOT UNIX)
  # There is a bug in NSI that does not handle full unix paths properly. Make
  # sure there is at least one set of four (4) backlasshes.
  #SET(CPACK_PACKAGE_ICON "${CMake_SOURCE_DIR}/Utilities/Release\\\\InstallIcon.bmp")
  #SET(CPACK_NSIS_INSTALLED_ICON_NAME "bin\\\\MyExecutable.exe")
  SET(CPACK_NSIS_DISPLAY_NAME "BaroboLab")
  SET(CPACK_NSIS_HELP_LINK "http://www.barobo.com")
  SET(CPACK_NSIS_URL_INFO_ABOUT "http://www.barobo.com")
  SET(CPACK_NSIS_CONTACT "david@barobo.com")
  SET(CPACK_NSIS_MODIFY_PATH ON)
ELSE(WIN32 AND NOT UNIX)
  #SET(CPACK_STRIP_FILES "bin/MyExecutable")
  #SET(CPACK_SOURCE_STRIP_FILES "")
ENDIF(WIN32 AND NOT UNIX)
SET(CPACK_PACKAGE_EXECUTABLES "BaroboLab" "BaroboLab")
