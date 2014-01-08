/* global Serenade, $ */
/* jshint  newcap: false */

$(function () {
    "use strict";

    var
        red = "X769",
        left = red,
        blue = "4PMN",
        right = blue,

        ctrl = {
            leftClick: function () {
                zeClicken(left);
            },
            rightClick: function () {
                zeClicken(right);
            },
            discon: function () {
                Robot.disconnectRobot(red);
                Robot.disconnectRobot(blue);
            },
            connect: function () {
                Robot.connectRobot(red);
                Robot.connectRobot(blue);
            },
            startOver: function (_, o) {
                var newNumber = giveMeNumber(10,10);
                o.topNumbers.update([newNumber]);
                o.topNumber = newNumber;
                resetGame(o, newNumber);
            },
        },

        model = Serenade({
            topNumbers: new Serenade.Collection([]),
            topNumber: '',
            rightVal: null,
            leftVal: null,
            leftDisabled: false,
            rightDisabled: false,
            leftFailed: false,
            rightFailed: false,
            totalSuccess: false,
            hasRobots: true,
        });

    /* Mock Robot object for testing without any robots attached.
     */

    var Robot;
    if (typeof window.Robot === "undefined") {
      Robot = {};
      [
        "connectRobot",
        "disconnectRobot",
        "getRobotIDList",
        "moveNB",
        "printMessage",
        "setColorRGB",
        "setJointSpeeds",
        "stop",
      ].forEach(function (method) {
        Robot[method] = function () {};
      });
      [
        "scrollUp",
        "scrollDown",
        "buttonChanged",
      ].forEach(function (event) {
        Robot[event] = {
            connect: function () {}
        };
      });
      model.hasRobots = false;
    }
    else {
      Robot = window.Robot;
    }

    function giveMeNumber (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // integer division, i.e. quotient
    function quotient (num, div) {
        return (num - (num % div)) / div;
    }

    function proceed (o) {
        var next;
        if (Math.random() >= 0.5) {
            next = o.leftVal;
        }
        else {
            next = o.rightVal;
        }
        o.topNumbers.push(next);
        o.topNumber = o.topNumbers.join(' -> ');
        resetGame(o, next);
    }

    function resetGame (o, n) {
        o.leftVal = quotient(n, 2) - 1;
        o.rightVal = quotient(n, 2) + 1;
        o.leftDisabled = false;
        o.rightDisabled = false;
        o.totalSuccess = false;
    }


    Robot.scrollUp.connect(function (robID) {
        if (robID === left) {
          if (!model.leftDisabled) {
              model.leftVal++;
          }
        }
        else {
          if (!model.rightDisabled) {
              model.rightVal++;
          }
        }
    });
    Robot.scrollDown.connect(function (robID) {
        if (robID === left) {
            if (!model.leftDisabled) {
                if (model.leftVal > 1.5) {
                    model.leftVal--;
                }
            }
        }
        else {
            if (!model.rightDisabled) {
                if (model.rightVal > 1.5) {
                    model.rightVal--;
                }
            }
        }
    });

    function zeClicken (robID) {
        var val, disabled, halfDone, fail;
        if (robID === left) {
            val = 'leftVal';
            disabled = 'leftDisabled';
            halfDone = model.rightDisabled;
            fail = 'leftFailed';
        }
        else {
            val = 'rightVal';
            disabled = 'rightDisabled';
            halfDone = model.leftDisabled;
            fail = 'rightFailed';
        }
        if (!model[disabled]) {
            if (model.topNumbers.last % model[val] === 0) {
                model[fail] = false;
                model[disabled] = true;
                if (halfDone) {
                    model.totalSuccess = true;
                    setTimeout(function () { proceed(model); }, 1500);
                }
            }
            else {
                model[fail] = true;
                setTimeout(function () { model[fail] = false; }, 1000);
            }
        }
    }


    Robot.buttonChanged.connect(zeClicken);

    ctrl.startOver(null, model);
    $("#challengeApp").replaceWith(Serenade.render('app', model, ctrl));

});
