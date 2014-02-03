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
                var newNumber = giveMeNumber(4,100);
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
            leftSuccess: false,
            rightSuccess: false,
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
    //function quotient (num, div) {
        //return (num - (num % div)) / div;
    //}

    function isPrime (n) {
        var i;
        for (i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }

    function proceed (o) {
        var min, max, next;
        if (o.leftVal <= o.rightVal) {
            min = o.leftVal;
            max = o.rightVal;
        }
        else {
            min = o.rightVal;
            max = o.leftVal;
        }

        if (!isPrime(max)) {
            next = max;
        }
        else if (!isPrime(min)) {
            next = min;
        }
        else {
            ctrl.startOver(null, o);
            return;
        }

        o.topNumbers.push(next);
        o.topNumber = o.topNumbers.join(' -> ');
        resetGame(o, next);
    }

    function resetGame (o, n) {
        o.leftVal = giveMeNumber(2, 2*n/3);
        o.rightVal = giveMeNumber(2,2*n/3);
        o.leftDisabled = false;
        o.rightDisabled = false;
        o.leftSuccess = false;
        o.rightSuccess = false;
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
        var top = model.topNumbers.last,
            val, otherVal, success, disabled, halfDone, fail;
        if (robID === left) {
            val = 'leftVal';
            otherVal = 'rightVal';
            disabled = 'leftDisabled';
            success = 'leftSuccess';
            halfDone = model.rightSuccess;
            fail = 'leftFailed';
        }
        else {
            val = 'rightVal';
            otherVal = 'leftVal';
            disabled = 'rightDisabled';
            success = 'rightSuccess';
            halfDone = model.leftSuccess;
            fail = 'rightFailed';
        }
        if (!model[disabled]) {
            if (halfDone && Math.abs(model[val] * model[otherVal] - top) < 0.001) {
                model[disabled] = true;
                model[success] = true;
                model.totalSuccess = true;
                setTimeout(function () { proceed(model); }, 1500);
            }
            else if (!halfDone && Math.abs(top % model[val]) < 0.001) {
                model[fail] = false;
                model[disabled] = true;
                model[success] = true;
            }
            else {
                model[fail] = true;
                model[disabled] = true;
                setTimeout(function () {
                    model[fail] = false;
                    model[disabled] = false;
                }, 1000);
            }
        }
    }


    Robot.buttonChanged.connect(zeClicken);

    ctrl.startOver(null, model);
    $("#challengeApp").replaceWith(Serenade.render('app', model, ctrl));

});
