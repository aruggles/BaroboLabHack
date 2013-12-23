# BaroboLab
# Barobo, Inc.

cmake_minimum_required(VERSION 2.8.9)

project(BAROBOLAB)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt5Core)

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

# Include required Qt libraries at install-time.
set(APPS "\${CMAKE_INSTALL_PREFIX}/bin/${TARGET}")
set(DIRS ${QT_LIBRARY_DIR})
install(CODE "
  include(BundleUtilities)
  fixup_bundle(\"${APPS}\" \"\" \"${DIRS}\")")

##############################################################################

include(CPack)
include(InstallRequiredSystemLibraries)
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "BaroboLab")
set(CPACK_PACKAGE_NAME "BaroboLab")
set(CPACK_PACKAGE_VENDOR "Barobo, inc.")
#set(CPACK_PACKAGE_DESCRIPTION_FILE "${CMAKE_CURRENT_SOURCE_DIR}/ReadMe.txt")
#set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/Copyright.txt")
#set(CPACK_PACKAGE_VERSION_MAJOR "1")
#set(CPACK_PACKAGE_VERSION_MINOR "3")
#set(CPACK_PACKAGE_VERSION_PATCH "2")
set(CPACK_PACKAGE_INSTALL_DIRECTORY "BaroboLab")
if(WIN32 AND NOT UNIX)
  # There is a bug in NSI that does not handle full unix paths properly. Make
  # sure there is at least one set of four (4) backlasshes.
  #set(CPACK_PACKAGE_ICON "${CMake_SOURCE_DIR}/Utilities/Release\\\\InstallIcon.bmp")
  #set(CPACK_NSIS_INSTALLED_ICON_NAME "bin\\\\MyExecutable.exe")
  set(CPACK_NSIS_DISPLAY_NAME "BaroboLab")
  set(CPACK_NSIS_HELP_LINK "http://www.barobo.com")
  set(CPACK_NSIS_URL_INFO_ABOUT "http://www.barobo.com")
  set(CPACK_NSIS_CONTACT "david@barobo.com")
  set(CPACK_NSIS_MODIFY_PATH ON)
else(WIN32 AND NOT UNIX)
  #set(CPACK_STRIP_FILES "bin/MyExecutable")
  #set(CPACK_SOURCE_STRIP_FILES "")
endif(WIN32 AND NOT UNIX)
set(CPACK_PACKAGE_EXECUTABLES "BaroboLab" "BaroboLab")
