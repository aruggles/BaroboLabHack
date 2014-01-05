#ifndef fancybrowser_robot_listener_h_
#define fancybrowser_robot_listener_h_

#include <QObject>
#include <QTimer>
#include "mobot.h"

class RobotListener : public QObject
{
  Q_OBJECT
public:
    RobotListener(mobot_t* robot, QString addr);
    ~RobotListener();

signals:
    void scrollUp(QString addr);
    void scrollDown(QString addr);

public slots:
    void startWork();
    void stopWork();
    void doWork();

private:
    mobot_t* m_robot;
    QString m_addr;
    QTimer* m_timer;
    double curJoint1Angle;
    double curJoint3Angle;
    bool initialized;
};

#endif
