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
    printf("I am testing the test.\n");
}
QString JsInterface::printMessage(const QString &param)
{
    printf("testing the print message.\n");
    qDebug() << param;
    return QString("Success");
}

