QT      +=  webkitwidgets network widgets
HEADERS =   mainwindow.h
SOURCES =   main.cpp \
            mainwindow.cpp
RESOURCES = jquery.qrc

INCLUDEPATH += libbarobo
LIBS += -Llibbarobo/build -Llibbarobo/build/BaroboConfigFile -Llibbarobo/build/BaroboConfigFile/mxml-2.7 \
    -lbaroboStatic -lbaroboconfigfile -lmxml

QMAKE_CXXFLAGS += -std=c++11

# install
target.path = $$[QT_INSTALL_EXAMPLES]/webkitwidgets/fancybrowser
INSTALLS += target
