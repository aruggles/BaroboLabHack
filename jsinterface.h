//
//  jsinterface.h
//  fancybrowser
//
//  Created by Adam Ruggles on 11/23/13.
//
//

#ifndef fancybrowser_jsinterface_h
#define fancybrowser_jsinterface_h

#include <QtWidgets>

class JsInterface : public QObject
{
    Q_OBJECT
public:
    Q_INVOKABLE void printDbg();
    Q_INVOKABLE QString printMessage(const QString &param);

};
#endif
