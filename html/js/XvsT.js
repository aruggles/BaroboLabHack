/* global Robot, $*/
/* exported runDemo */
var iterDemo = (function() {
  "use strict";
  var iter = 0;
  var timeout = 200; // milliseconds
  var step = timeout/1000.0;
  var tolerance = step / 2;
  var xstop, plot;
  var d1, d2, d3;

  function iterDemo(x) {
    var reset = false;
    var firstPlot = true;

    if (typeof x !== "undefined" && x !== null) {
      reset = true;
      if (typeof plot !== "undefined") {
        firstPlot = false;
      }
    }

    if (reset) {
      iter = 0;
      xstop = x;
      d1 = [];
      d2 = [];
      d3 = [];
    }
    iter = iter + step;
    Robot.printMessage(iter);
    d1.push([0, 4]);
    d1.push([iter, 0.5*iter+4]);
    d2.push([0, -2]);
    d2.push([iter, 2*iter-2]);

    d3.push([6, 10]); // Just to make sure the graph stays the right size
    if (firstPlot) {
      $.plot("#placeholder", [ d1, d2, d3 ]);
    } else {
      plot.setData([d1, d2, d3]);
      plot.draw();
    }
    if((xstop - iter) > (tolerance)) {
      setTimeout(iterDemo, timeout);
    }
  }

  return iterDemo;
})();

function runDemo() {
  "use strict";
  var intersectGuess = parseFloat($("#guess").val());
  if (!isNaN(intersectGuess)) {
    if (typeof Robot !== 'undefined' && Robot !== null) {
      var wheelradius = 1.75;   // inches
      //var robotList = Robot.getRobotIDList();
      var red = "BKWT";
      var blue = "KCXS";
      Robot.connectRobot(red);
      Robot.connectRobot(blue);

      var redfunc = function(x) {
        return 0.5 * x + 4;
      };

      var bluefunc = function(x) {
        return 2 * x - 2;
      };

      var xstart = 0;
      var xstop = intersectGuess;

      var reddist = redfunc(xstop) - redfunc(xstart);
      var bluedist = bluefunc(xstop) - bluefunc(xstart);

      var redradians = reddist / wheelradius;
      var blueradians = bluedist / wheelradius;

      var redspeed = 0.5 / 1.75;
      var bluespeed = 2 / 1.75;

      Robot.setJointSpeeds(red, redspeed, redspeed, redspeed, redspeed);
      Robot.setJointSpeeds(blue, bluespeed, bluespeed, bluespeed, bluespeed);

      Robot.moveNB(red, redradians, 0, -redradians, 0);
      Robot.moveNB(blue, blueradians, 0, -blueradians, 0);
      iterDemo(intersectGuess);
    }
  }
}
