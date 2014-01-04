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

JsInterface *g_jsinterface = NULL;

JsInterface::JsInterface (MainWindow* mainWindow) : m_mainWindow(mainWindow) 
{ 
  g_jsinterface = this;
}

void JsInterface::printDbg()
{
    qDebug() << QString("I am testing the test.\n");
}
QString JsInterface::printMessage(const QString &param)
{
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

QString JsInterface::getJointAngles (const QString& address) {
  return m_mainWindow->getJointAngles(address);
}

int JsInterface::setJointSpeeds (const QString& address, double speeds1, double speeds2, double speeds3, double speeds4) {
  return m_mainWindow->setJointSpeeds(address, speeds1, speeds2, speeds3, speeds4);
}

int JsInterface::setColorRGB(const QString& address, int r, int g, int b) {
  return m_mainWindow->setColorRGB(address, r, g, b);
}

int JsInterface::stop(const QString& address) {
  return m_mainWindow->stop(address);
}

void JsInterface::robotButtonCallbackWrapper(const char* serialID, int button, int buttondown)
{
  if(buttondown)
    emit buttonChanged(serialID, button, buttondown);
}

void JsInterface::robotButtonCallback(void* data, int button, int buttondown)
{
  g_jsinterface->robotButtonCallbackWrapper(static_cast<const char*>(data), button, buttondown);
}

