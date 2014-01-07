/* global Robot, Serenade, $ */
/* jshint  newcap: false */

$(function () {
    "use strict";

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
                o.leftVal = quotient(model.topNumber, 2) - 1;
                o.rightVal = quotient(model.topNumber, 2) + 1;
                o.leftDisabled = null;
                o.rightDisabled = null;
            },
        },

        model = Serenade({
            topNumber: giveMeNumber(4, 96),
            rightVal: null,
            leftVal: null,
            leftDisabled: null,
            rightDisabled: null,
        });
        model.rightVal = giveMeNumber(1, model.topNumber);
        model.leftVal = giveMeNumber(1, model.topNumber);

    Robot.scrollUp.connect(function (robID) {
        if (robID === left) {
          if (model.leftDisabled === null) {
              model.leftVal++;
          }
        }
        else {
          if (model.rightDisabled === null) {
              model.rightVal++;
          }
        }
    });
    Robot.scrollDown.connect(function (robID) {
        if (robID === left) {
            if (model.leftDisabled === null && model.leftVal > 1.1) {
                model.leftVal--;
            }
        }
        else {
            if (model.rightDisabled === null && model.rightVal > 1.1) {
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
                model[disabled] = true;
            }
        }
        else {
            alert("Guess again!");
        }
    });

    ctrl.startOver(null, model);
    $("#challengeApp").replaceWith(Serenade.render('app', model, ctrl));
});
