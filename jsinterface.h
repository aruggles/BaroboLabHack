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

class MainWindow;

class JsInterface : public QObject
{
    Q_OBJECT

public:
    JsInterface (MainWindow* mainWindow);

    Q_PROPERTY(bool buttonA READ buttonA);
    bool buttonA() const { return buttonA_; }

    Q_PROPERTY(bool buttonB READ buttonB);
    bool buttonB() const { return buttonB_; }

    Q_PROPERTY(bool buttonPwr READ buttonPwr);
    bool buttonPwr() const { return buttonPwr_; }

    Q_INVOKABLE void printDbg();
    Q_INVOKABLE QString printMessage(const QString &param);
    Q_INVOKABLE QString getRobotIDList ();
    Q_INVOKABLE bool connectRobot (const QString& address);
    Q_INVOKABLE void disconnectRobot (const QString& address);
    Q_INVOKABLE int move (const QString& address, double angle1, double angle2, double angle3, double angle4);
    Q_INVOKABLE int moveNB (const QString& address, double angle1, double angle2, double angle3, double angle4);
    Q_INVOKABLE int moveTo (const QString& address, double angle1, double angle2, double angle3, double angle4);
    Q_INVOKABLE int moveToNB (const QString& address, double angle1, double angle2, double angle3, double angle4);
    Q_INVOKABLE QString getJointAngles (const QString& address);
    Q_INVOKABLE int setJointSpeeds (const QString& address, double speeds1, double speeds2, double speeds3, double speeds4);
    Q_INVOKABLE int setColorRGB (const QString& address, int r, int g, int b);
    Q_INVOKABLE int stop (const QString& address);

    void robotButtonCallbackWrapper(int button, int buttondown);
    static void robotButtonCallback(void* data, int button, int buttondown);

signals:
    void buttonChanged(int button);

private:
    MainWindow* m_mainWindow;
    bool buttonA_;
    bool buttonB_;
    bool buttonPwr_;
};
#endif
