#include "robotlistener.h"
#include <QDebug>
#include <QThread>

RobotListener::RobotListener(mobot_t* robot, QString addr)
{
  m_robot = robot;
  m_addr = addr;
  m_timer = new QTimer(this);
  initialized = false;
}

RobotListener::~RobotListener()
{
  stopWork();
}

void RobotListener::startWork()
{
  QObject::connect(m_timer, SIGNAL(timeout()), this, SLOT(doWork()));
  m_timer->start(150);
}

void RobotListener::stopWork()
{
  m_timer->stop();
}

void RobotListener::doWork()
{
  double curJoint2Angle;
  double curJoint4Angle;
 
  double a[4]; 

  double delta = 10.0*M_PI/180.0;

  int rc;

  if(!initialized) {
    rc = Mobot_getJointAngles(m_robot, 
        &curJoint1Angle,
        &curJoint2Angle,
        &curJoint3Angle,
        &curJoint4Angle);
    if(rc) return;
  }

  rc = Mobot_getJointAngles(m_robot,
      &a[0],
      &a[1],
      &a[2],
      &a[3]);
  if(rc) return;
  //qDebug() << m_addr << curJoint1Angle << a[0] << m_robot;
  if((a[0] - curJoint1Angle) > delta) {
    curJoint1Angle = a[0];
    emit scrollUp(m_addr);
  }
  if((curJoint1Angle - a[0] > delta)) {
    curJoint1Angle = a[0];
    emit scrollDown(m_addr);
  }
  QThread::yieldCurrentThread();
}
