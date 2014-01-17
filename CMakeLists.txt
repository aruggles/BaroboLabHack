# BaroboLab
# Barobo, Inc.

cmake_minimum_required(VERSION 2.8.9)
cmake_policy(VERSION 2.8.9)
cmake_policy(SET CMP0020 OLD) # we'll link with QTMAIN manually

project(BaroboLab)

add_subdirectory(../libbarobo libbarobo)

set(VERSION_MAJOR 0)
set(VERSION_MINOR 0)
set(VERSION ${VERSION_MAJOR}.${VERSION_MINOR})

if(UNIX)
  set(DEF_INSTALL_BIN_DIR bin)
  set(DEF_INSTALL_SHARE_DIR share/${PROJECT_NAME})
else()
  set(DEF_INSTALL_BIN_DIR bin)
  # Yup. Just doing this until we figure out a better way to identify where
  # BaroboLab content is located. Alternatively, use the share/BaroboLab dir,
  # and use GetModuleName() inside fancybrowser to figure out where its data
  # must be?
  set(DEF_INSTALL_SHARE_DIR bin)
endif()

set(INSTALL_BIN_DIR ${DEF_INSTALL_BIN_DIR}
  CACHE PATH "binary installation directory")
set(INSTALL_SHARE_DIR ${DEF_INSTALL_SHARE_DIR}
  CACHE PATH "data installation directory")

message(STATUS "Will install binaries to ${CMAKE_INSTALL_PREFIX}/${INSTALL_BIN_DIR}")
message(STATUS "Will install data to ${CMAKE_INSTALL_PREFIX}/${INSTALL_SHARE_DIR}")

##############################################################################
# Content

install(DIRECTORY html DESTINATION ${INSTALL_SHARE_DIR})

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt5Core)

find_package(LIBBAROBO)
include_directories(${LIBBAROBO_INCLUDE_DIRS})

# Using gnu++11 instead of c++11 to workaround off64_t issue in late versions
# of MinGW: http://sourceforge.net/p/mingw/bugs/2024
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++11")

##############################################################################
# Targets

set(TARGET fancybrowser)

qt5_add_resources(RESOURCES jquery.qrc)

set(SOURCES main.cpp mainwindow.cpp jsinterface.cpp robotlistener.cpp)

add_executable(${TARGET} ${SOURCES} ${RESOURCES})

# FIXME when it becomes feasible to require CMake >= 2.8.11, remove this crap
# search on the internet for "CMake policy CMP0020" to read why
set(QTMAIN)
if(WIN32)
  set(QTMAIN Qt5::WinMain) # imported from Qt5Core
endif()

target_link_libraries(${TARGET} ${LIBBAROBO_LIBRARIES} ${QTMAIN})
qt5_use_modules(${TARGET} Widgets Network WebKitWidgets)

install(TARGETS ${TARGET} RUNTIME DESTINATION ${INSTALL_BIN_DIR})

# Include required libraries at install-time. This is the Windows way.
if(WIN32)
  # The application we'll be fixing up is the main target executable.
  # Note the "\$" here. When the install code below is executed, we want the
  # CMAKE_INSTALL_PREFIX as set at install time, not as set right now. These
  # would be different in the case of CPack, which sets its own install
  # prefix.
  set(APPS "\${CMAKE_INSTALL_PREFIX}/${INSTALL_BIN_DIR}/${TARGET}${CMAKE_EXECUTABLE_SUFFIX}")

  # At the moment, fixup_bundle seems to be detecting required plugins. If we
  # needed to manually specify plugins, I think they would go here.
  set(LIBS)

  # If we need to manually specify library search paths, they would go here.
  set(DIRS)

  # So, gp_cmd_paths ...
  # fixup_bundle calls get_prerequisites (GetPrerequisites.cmake) to enumerate
  # all DLL dependencies for the given ${APPS}. get_prerequisites depends on
  # an external tool (ldd, otool, dumpbin, or objdump) to figure out this
  # info. Under Windows, our two options are dumpbin (provided by MS Visual
  # Studio) and objdump (provided by MinGW). get_prerequisites is already
  # disgustingly inefficient, and objdump exacerbates this problem by being
  # both a memory hog and itself disgustingly inefficient (or at least, the
  # way get_prerequisites uses it is inefficient--I haven't looked too hard).
  # For very simple applications it will work, but for a Qt application, my
  # VM ran out of memory before completing fixup_bundle. So, fuck that. We
  # need to use dumpbin.
  #
  # Now, dumpbin lives in <path to Visual Studio>\VC\bin.
  # GetPrerequisites.cmake has some paths to older versions of Visual Studio
  # hardcoded in, but it lacks the path to 10.0. (There is an overarching
  # CMake issue, in my opinion, that there is no FindMSVC.cmake module, which
  # would obviate the need for hardcoding that crap, but that's beside the
  # point.) Our options are limited:
  # 1) require the builder to hack the MSVC path into
  #    <path to CMake modules>\GetPrerequisites.cmake. This would mean
  #    modifying CMake's default install, which is pretty tacky.
  # 2) require the builder to add the MSVC path to the PATH environment
  #    variable. But the MinGW PATH has enough problems as it is, I'd like to
  #    avoid making them worse inadvertantly.
  # 3) Set gp_cmd_paths ahead of time (get_prerequisites only appends to the
  #    list, it doesn't obliterate it). This is what I'm doing here.
  #
  # Long-term fix: write my own FindMSVC.cmake module and programmatically set
  # gp_cmd_paths from its output.
  # Longer-term fix: fix GetPrerequisites.cmake. This is ridiculous.
  install(CODE "
    include(BundleUtilities)
    set(gp_cmd_paths \${gp_cmd_paths}
      \"C:/Program Files/Microsoft Visual Studio 10.0/VC/bin\"
      \"C:/Program Files (x86)/Microsoft Visual Studio 10.0/VC/bin\")
    fixup_bundle(\"${APPS}\" \"${LIBS}\" \"${DIRS}\")")
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
set(CPACK_PACKAGE_INSTALL_DIRECTORY "BaroboLab ${VERSION_MAJOR}.${VERSION_MINOR}")
if(WIN32 AND NOT UNIX)
  # There is a bug in NSI that does not handle full unix paths properly. Make
  # sure there is at least one set of four (4) backlasshes.
  #set(CPACK_PACKAGE_ICON "${CMake_SOURCE_DIR}/Utilities/Release\\\\InstallIcon.bmp")
  #set(CPACK_NSIS_INSTALLED_ICON_NAME "bin\\\\MyExecutable.exe")
  set(CPACK_NSIS_DISPLAY_NAME "BaroboLab ${VERSION_MAJOR}.${VERSION_MINOR}")
  set(CPACK_NSIS_HELP_LINK "http://www.barobo.com")
  set(CPACK_NSIS_URL_INFO_ABOUT "http://www.barobo.com")
  set(CPACK_NSIS_CONTACT "david@barobo.com")
  set(CPACK_NSIS_MODIFY_PATH ON)
else(WIN32 AND NOT UNIX)
  #set(CPACK_STRIP_FILES "bin/MyExecutable")
  #set(CPACK_SOURCE_STRIP_FILES "")
endif(WIN32 AND NOT UNIX)
set(CPACK_PACKAGE_EXECUTABLES "${TARGET}" "BaroboLab")
include(CPack)
