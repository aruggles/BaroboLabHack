# BaroboLab
# Barobo, Inc.

cmake_minimum_required(VERSION 2.8.9)

project(BaroboLab)

set(VERSION_MAJOR 0)
set(VERSION_MINOR 0)
set(VERSION ${VERSION_MAJOR}.${VERSION_MINOR})

if(CMAKE_HOST_WIN32)
  set(DEF_INSTALL_BIN_DIR "${PROJECT_NAME} ${VERSION}")
  set(DEF_INSTALL_SHARE_DIR ${DEF_INSTALL_BIN_DIR})
else()
  set(DEF_INSTALL_BIN_DIR bin)
  set(DEF_INSTALL_SHARE_DIR share/${PROJECT_NAME})
endif()

set(INSTALL_BIN_DIR ${DEF_INSTALL_BIN_DIR}
  CACHE PATH "binary installation directory")
set(INSTALL_SHARE_DIR ${DEF_INSTALL_SHARE_DIR}
  CACHE PATH "data installation directory")

##############################################################################
# Content

install(DIRECTORY html DESTINATION ${INSTALL_SHARE_DIR})

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt5Core)

find_package(LIBBAROBO)
include_directories(${LIBBAROBO_INCLUDE_DIRS})

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

##############################################################################
# Targets

set(TARGET fancybrowser)

qt5_add_resources(RESOURCES jquery.qrc)

set(SOURCES main.cpp mainwindow.cpp jsinterface.cpp)

add_executable(${TARGET} ${SOURCES} ${RESOURCES})
target_link_libraries(${TARGET} ${LIBBAROBO_LIBRARIES})
qt5_use_modules(${TARGET} Widgets Network WebKitWidgets)

install(TARGETS ${TARGET} RUNTIME DESTINATION ${INSTALL_BIN_DIR})

# Include required libraries at install-time. This is the Windows way.
if(CMAKE_HOST_WIN32)
  set(APPS "\${CMAKE_INSTALL_PREFIX}/${INSTALL_BIN_DIR}/${TARGET}")
  set(DIRS ${QT_LIBRARY_DIR})
  install(CODE "
    include(BundleUtilities)
    fixup_bundle(\"${APPS}\" \"\" \"${DIRS}\")")
endif()

##############################################################################

include(InstallRequiredSystemLibraries)
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "BaroboLab")
set(CPACK_PACKAGE_NAME "BaroboLab")
set(CPACK_PACKAGE_VENDOR "Barobo, inc.")
#set(CPACK_PACKAGE_DESCRIPTION_FILE "${CMAKE_CURRENT_SOURCE_DIR}/ReadMe.txt")
#set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/Copyright.txt")
set(CPACK_PACKAGE_VERSION_MAJOR ${VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${VERSION_MINOR})
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
include(CPack)
