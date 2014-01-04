/****************************************************************************
**
** Copyright (C) 2013 Digia Plc and/or its subsidiary(-ies).
** Contact: http://www.qt-project.org/legal
**
** This file is part of the examples of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:BSD$
** You may use this file under the terms of the BSD license as follows:
**
** "Redistribution and use in source and binary forms, with or without
** modification, are permitted provided that the following conditions are
** met:
**   * Redistributions of source code must retain the above copyright
**     notice, this list of conditions and the following disclaimer.
**   * Redistributions in binary form must reproduce the above copyright
**     notice, this list of conditions and the following disclaimer in
**     the documentation and/or other materials provided with the
**     distribution.
**   * Neither the name of Digia Plc and its Subsidiary(-ies) nor the names
**     of its contributors may be used to endorse or promote products derived
**     from this software without specific prior written permission.
**
**
** THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
** "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
** LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
** A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
** OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
** LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
** DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
** THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
** (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
** OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
**
** $QT_END_LICENSE$
**
****************************************************************************/

#include <unistd.h>

#include <QtWidgets>
#include <QtNetwork>
#include <QtWebKitWidgets>
#include "mainwindow.h"
#include "jsinterface.h"

//! [1]

MainWindow::MainWindow(const QUrl& url) : m_dongle(new mobot_t)
{
    progress = 0;

    QFile file;
    file.setFileName(":/jquery.min.js");
    file.open(QIODevice::ReadOnly);
    jQuery = file.readAll();
    jQuery.append("\nvar qt = { 'jQuery': jQuery.noConflict(true) };");
    file.close();
//! [1]

    QNetworkProxyFactory::setUseSystemConfiguration(true);

    m_interface = new JsInterface(this);
//! [2]
    view = new QWebView(this);
    view->load(url);
    connect(view, SIGNAL(loadFinished(bool)), SLOT(adjustLocation()));
    connect(view, SIGNAL(titleChanged(QString)), SLOT(adjustTitle()));
    connect(view, SIGNAL(loadProgress(int)), SLOT(setProgress(int)));
    connect(view, SIGNAL(loadFinished(bool)), SLOT(finishLoading(bool)));
    connect(view->page()->mainFrame(), SIGNAL(javaScriptWindowObjectCleared()),
            this, SLOT(populateJavaScriptWindowObject()));

    locationEdit = new QLineEdit(this);
    locationEdit->setSizePolicy(QSizePolicy::Expanding, locationEdit->sizePolicy().verticalPolicy());
    connect(locationEdit, SIGNAL(returnPressed()), SLOT(changeLocation()));

    QToolBar *toolBar = addToolBar(tr("Navigation"));
    toolBar->addAction(view->pageAction(QWebPage::Back));
    toolBar->addAction(view->pageAction(QWebPage::Forward));
    toolBar->addAction(view->pageAction(QWebPage::Reload));
    toolBar->addAction(view->pageAction(QWebPage::Stop));
    toolBar->addWidget(locationEdit);
//! [2]

    QMenu *viewMenu = menuBar()->addMenu(tr("&View"));
    QAction* viewSourceAction = new QAction("Page Source", this);
    connect(viewSourceAction, SIGNAL(triggered()), SLOT(viewSource()));
    viewMenu->addAction(viewSourceAction);

//! [3]
    QMenu *effectMenu = menuBar()->addMenu(tr("&Effect"));
    effectMenu->addAction("Highlight all links", this, SLOT(highlightAllLinks()));

    rotateAction = new QAction(this);
    rotateAction->setIcon(style()->standardIcon(QStyle::SP_FileDialogDetailedView));
    rotateAction->setCheckable(true);
    rotateAction->setText(tr("Turn images upside down"));
    connect(rotateAction, SIGNAL(toggled(bool)), this, SLOT(rotateImages(bool)));
    effectMenu->addAction(rotateAction);

    QMenu *toolsMenu = menuBar()->addMenu(tr("&Tools"));
    toolsMenu->addAction(tr("Remove GIF images"), this, SLOT(removeGifImages()));
    toolsMenu->addAction(tr("Remove all inline frames"), this, SLOT(removeInlineFrames()));
    toolsMenu->addAction(tr("Remove all object elements"), this, SLOT(removeObjectElements()));
    toolsMenu->addAction(tr("Remove all embedded elements"), this, SLOT(removeEmbeddedElements()));

    setCentralWidget(view);
    setUnifiedTitleAndToolBarOnMac(true);

    baroboInit();
    
    qDebug() << "App path : " << qApp->applicationDirPath();
}
//! [3]

void MainWindow::viewSource()
{
    QNetworkAccessManager* accessManager = view->page()->networkAccessManager();
    QNetworkRequest request(view->url());
    QNetworkReply* reply = accessManager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(slotSourceDownloaded()));
}

void MainWindow::slotSourceDownloaded()
{
    QNetworkReply* reply = qobject_cast<QNetworkReply*>(const_cast<QObject*>(sender()));
    QTextEdit* textEdit = new QTextEdit(NULL);
    textEdit->setAttribute(Qt::WA_DeleteOnClose);
    textEdit->show();
    textEdit->setPlainText(reply->readAll());
    reply->deleteLater();
}

//! [4]
void MainWindow::adjustLocation()
{
    locationEdit->setText(view->url().toString());
}

void MainWindow::changeLocation()
{
    QUrl url = QUrl::fromUserInput(locationEdit->text());
    view->load(url);
    view->setFocus();
}
//! [4]

//! [5]
void MainWindow::adjustTitle()
{
    if (progress <= 0 || progress >= 100)
        setWindowTitle(view->title());
    else
        setWindowTitle(QString("%1 (%2%)").arg(view->title()).arg(progress));
}

void MainWindow::setProgress(int p)
{
    progress = p;
    adjustTitle();
}
//! [5]

//! [6]
void MainWindow::finishLoading(bool)
{
    progress = 100;
    adjustTitle();
    view->page()->mainFrame()->evaluateJavaScript(jQuery);

    rotateImages(rotateAction->isChecked());
}
//! [6]

//! [7]
void MainWindow::highlightAllLinks()
{
    // We append '; undefined' after the jQuery call here to prevent a possible recursion loop and crash caused by
    // the way the elements returned by the each iterator elements reference each other, which causes problems upon
    // converting them to QVariants.
    QString code = "qt.jQuery('a').each( function () { qt.jQuery(this).css('background-color', 'yellow') } ); undefined";
    view->page()->mainFrame()->evaluateJavaScript(code);
}
//! [7]

//! [8]
void MainWindow::rotateImages(bool invert)
{
    QString code;

    // We append '; undefined' after each of the jQuery calls here to prevent a possible recursion loop and crash caused by
    // the way the elements returned by the each iterator elements reference each other, which causes problems upon
    // converting them to QVariants.
    if (invert)
        code = "qt.jQuery('img').each( function () { qt.jQuery(this).css('-webkit-transition', '-webkit-transform 2s'); qt.jQuery(this).css('-webkit-transform', 'rotate(180deg)') } ); undefined";
    else
        code = "qt.jQuery('img').each( function () { qt.jQuery(this).css('-webkit-transition', '-webkit-transform 2s'); qt.jQuery(this).css('-webkit-transform', 'rotate(0deg)') } ); undefined";
    view->page()->mainFrame()->evaluateJavaScript(code);
}
//! [8]

//! [9]
void MainWindow::removeGifImages()
{
    QString code = "qt.jQuery('[src*=gif]').remove()";
    view->page()->mainFrame()->evaluateJavaScript(code);
}

void MainWindow::removeInlineFrames()
{
    QString code = "qt.jQuery('iframe').remove()";
    view->page()->mainFrame()->evaluateJavaScript(code);
}

void MainWindow::removeObjectElements()
{
    QString code = "qt.jQuery('object').remove()";
    view->page()->mainFrame()->evaluateJavaScript(code);
}

void MainWindow::removeEmbeddedElements()
{
    QString code = "qt.jQuery('embed').remove()";
    view->page()->mainFrame()->evaluateJavaScript(code);
}
//! [9]

void MainWindow::baroboInit () {
  Mobot_init(m_dongle.get());
  char tty[64];
  if (-1 == Mobot_dongleGetTTY(tty, sizeof(tty))) {
    qWarning("(barobolab) WARNING: Mobot_dongleGetTTY failed\n");
  }
  if (-1 == Mobot_connectWithTTY(m_dongle.get(), tty)) {
    qWarning("(barobolab) WARNING: Mobot_connectWithTTY failed\n");
  }
  Mobot_setDongleMobot(m_dongle.get());
}

QString MainWindow::getRobotIDList () {
  Mobot_clearQueriedAddresses(m_dongle.get());

  if (-1 == Mobot_queryAddresses(m_dongle.get())) {
    qFatal("(barobolab) ERROR: Mobot_queryAddresses failed\n");
  }

#ifdef _WIN32
  Sleep(1000);
#else
  sleep(1);
#endif

  mobotInfo_t* mobotInfo = nullptr;
  int numScanned = 0;
  if (-1 == Mobot_getChildrenInfo(m_dongle.get(), &mobotInfo, &numScanned)) {
    qFatal("(barobolab) ERROR: Mobot_getChildrenInfo failed\n");
  }
  
  QString botlist ("[ ");
  botlist += "\"";
  botlist += m_dongle->serialID;
  botlist += "\"";

  for (int i = 0; i < numScanned; ++i) {
    botlist += ", \"";
    botlist += mobotInfo[i].serialID;
    botlist += "\"";
  }
  botlist += " ]";

  qDebug() << botlist << '\n';

  return botlist;
}

bool MainWindow::connectRobot (const QString& address) {
  if (m_connectedRobots.end() != m_connectedRobots.find(address)) {
    /* The requested robot is already connected */
    return true;
  }

  auto newrobot = new mobot_t;
  Mobot_init(newrobot);

  /* extract the 8-bit byte array from QString, from which we can then extract
   * the C-string */
  auto baAddress = address.toLocal8Bit();

  if (-1 == Mobot_connectWithAddress(newrobot, baAddress.data(), 1)) {
    delete newrobot;
    qDebug() << "(barobolab) ERROR: Mobot_connectWithTTY failed\n";
    return false;
  }
  Mobot_enableButtonCallback(newrobot, strdup(baAddress.data()), JsInterface::robotButtonCallback);
  auto l = new RobotListener(newrobot, address);
  QObject::connect(l, SIGNAL(scrollUp(QString)), m_interface, SLOT(scrollUpSlot(QString)));
  QObject::connect(l, SIGNAL(scrollDown(QString)), m_interface, SLOT(scrollDownSlot(QString)));
  QThread *thread = new QThread(this);
  l->moveToThread(thread);
  thread->start();
  QMetaObject::invokeMethod(l, "startWork", Qt::QueuedConnection);
  m_connectedRobots.insert(std::make_pair(address, newrobot));
  m_robotListeners.insert(std::make_pair(address, l));
  return true;
}

void MainWindow::disconnectRobot (const QString& address) {
  auto it2 = m_robotListeners.find(address);
  if (m_robotListeners.end() != it2) {
    delete it2->second;
    m_robotListeners.erase(it2);
  }

  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    return;
  }
  Mobot_disconnect(it->second);
  delete it->second;
  m_connectedRobots.erase(it);
}

int MainWindow::move (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    return -1;
  }
  return Mobot_move(it->second, angle1, angle2, angle3, angle4);
}

int MainWindow::moveNB (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    return -1;
  }
  return Mobot_moveNB(it->second, angle1, angle2, angle3, angle4);
}

int MainWindow::moveTo (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    return -1;
  }
  return Mobot_moveTo(it->second, angle1, angle2, angle3, angle4);
}

int MainWindow::moveToNB (const QString& address, double angle1, double angle2, double angle3, double angle4) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    return -1;
  }
  return Mobot_moveToNB(it->second, angle1, angle2, angle3, angle4);
}

QString MainWindow::getJointAngles (const QString& address) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    qDebug() << "(barobolab) ERROR: getJointAngles on disconnected " << address << '\n';
    return "[]";
  }
  double a1, a2, a3, a4;
  if (-1 == Mobot_getJointAngles(it->second, &a1, &a2, &a3, &a4)) {
    qDebug() << "(barobolab) ERROR: Mobot_getJointAngles\n";
    return "[]";
  }

  QString angles;
  angles.sprintf("[ %f, %f, %f, %f ]", a1, a2, a3, a4);
  qDebug() << angles << '\n';
  return angles;
}

int MainWindow::setJointSpeeds (const QString& address, double speeds1, double speeds2, double speeds3, double speeds4) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    qDebug() << "(barobolab) ERROR: setJointSpeeds on disconnected " << address << '\n';
    return -1;
  }
  return Mobot_setJointSpeeds(it->second, speeds1, speeds2, speeds3, speeds4);
}

int MainWindow::setColorRGB (const QString& address, int r, int g, int b) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    qDebug() << "(barobolab) ERROR: setColorRGB on disconnected " << address << '\n';
    return -1;
  }
  return Mobot_setColorRGB(it->second, r, g, b);
}

int MainWindow::stop (const QString& address) {
  auto it = m_connectedRobots.find(address);
  if (m_connectedRobots.end() == it) {
    qDebug() << "(barobolab) ERROR: setColorRGB on disconnected " << address << '\n';
    return -1;
  }
  return Mobot_stop(it->second);
}

void MainWindow::populateJavaScriptWindowObject()
{
    view->page()->mainFrame()->addToJavaScriptWindowObject("Robot", m_interface);
}

