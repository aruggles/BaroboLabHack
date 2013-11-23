QT      +=  webkitwidgets network widgets
HEADERS =   mainwindow.h \
            jsinterface.h
SOURCES =   main.cpp \
            mainwindow.cpp \
            jsinterface.cpp
RESOURCES = jquery.qrc

# install
target.path = $$[QT_INSTALL_EXAMPLES]/webkitwidgets/fancybrowser
INSTALLS += target
