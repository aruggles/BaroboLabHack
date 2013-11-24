//
//  jsinterface.cpp
//  fancybrowser
//
//  Created by Adam Ruggles on 11/23/13.
//
//

#include "jsinterface.h"
#include "mainwindow.h"

#include <stdio.h>

JsInterface::JsInterface (MainWindow* mainWindow) : m_mainWindow(mainWindow) { }

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

QString JsInterface::getRobotIDList () {
    return m_mainWindow->getRobotIDList();
}

bool JsInterface::connectRobot (const QString& address) {
    return m_mainWindow->connectRobot(address);
}

void JsInterface::disconnectRobot (const QString& address) {
  m_mainWindow->disconnectRobot(address);
}

int JsInterface::move (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  return m_mainWindow->move(address, angle1, angle2, angle3, angle4);
}

int JsInterface::moveNB (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  return m_mainWindow->moveNB(address, angle1, angle2, angle3, angle4);
}

int JsInterface::moveTo (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  return m_mainWindow->moveTo(address, angle1, angle2, angle3, angle4);
}

int JsInterface::moveToNB (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  return m_mainWindow->moveToNB(address, angle1, angle2, angle3, angle4);
}
