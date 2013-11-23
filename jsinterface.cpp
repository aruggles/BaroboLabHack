//
//  jsinterface.cpp
//  fancybrowser
//
//  Created by Adam Ruggles on 11/23/13.
//
//

#include "jsinterface.h"
#include <stdio.h>

void JsInterface::printDbg()
{
    qDebug() << QString("I am testing the test.\n");
}
QString JsInterface::printMessage(const QString &param)
{
    qDebug() << param;
    return QString("Success");
}

