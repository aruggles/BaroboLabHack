/* global Serenade, $ */
/* jshint  newcap: false */

$(function () {
    "use strict";

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

    var
        red = "X769",
        left = red,
        blue = "4PMN",
        //right = blue,

        ctrl = {
            discon: function () {
                Robot.disconnectRobot(red);
                Robot.disconnectRobot(blue);
            },
            connect: function () {
                Robot.connectRobot(red);
                Robot.connectRobot(blue);
            },
            startOver: function (_, o) {
                o.topNumber = giveMeNumber(10,96);
                o.leftVal = quotient(o.topNumber, 2) - 1;
                o.rightVal = quotient(o.topNumber, 2) + 1;
                o.leftDisabled = false;
                o.rightDisabled = false;
            },
        },

        model = Serenade({
            topNumber: giveMeNumber(4, 96),
            rightVal: null,
            leftVal: null,
            leftDisabled: false,
            rightDisabled: false,
        });
        model.rightVal = giveMeNumber(1, model.topNumber);
        model.leftVal = giveMeNumber(1, model.topNumber);

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
                model.leftVal--;
            }
        }
        else {
            if (!model.rightDisabled) {
                model.rightVal--;
            }
        }
    });

    Robot.buttonChanged.connect(function (robID) {
        var val, disabled, halfDone;
        if (robID === left) {
            val = 'leftVal';
            disabled = 'leftDisabled';
            halfDone = model.rightVal !== null;
        }
        else {
            val = 'rightVal';
            disabled = 'rightDisabled';
            halfDone = model.leftVal !== null;
        }
        if (model.topNumber % model[val] === 0) {
            if (halfDone) {
                alert("YES");
            }
            else {
                alert("Success -- now waiting for teammate");
                model.set("leftDisabled", true);
                model.set("rightDisabled", true);
            }
        }
        else {
            alert("Guess again!");
        }
    });

    ctrl.startOver(null, model);
    $("#challengeApp").replaceWith(Serenade.render('app', model, ctrl));
});
