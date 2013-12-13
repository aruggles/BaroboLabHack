/* jshint jquery: true */
/* global Robot */
/* exported runDemo */
(function() {

"use strict";

var cop = {
  color: "blue",
  label: "cop",
  data: [],
};
var robber = {
  color: "red",
  label: "robber",
  data: [],
};

var xvstSeries = [
  Object.create(cop),
  Object.create(robber)
];

var posSeries = [
  Object.create(cop),
  Object.create(robber)
];
posSeries[0].data = [[1, -2]];
posSeries[1].data = [[1, 4]];

var xvst = $.plot("#xvst", xvstSeries, {
  xaxis: {
    min: 0,
    max: 6,
    tickSize: 1,
    tickDecimals: 0,
  },
  yaxis: {
    min: -4,
    max: 12,
    tickSize: 2,
    tickDecimals: 0,
  },
});

var pos = $.plot("#pos", posSeries, {
  xaxis: {
    show: false,
    reserveSpace: true,
    min: 0,
    max: 2,
    tickSize: 1,
    tickDecimals: 0,
  },
  yaxis: {
    min: -4,
    max: 12,
    tickSize: 2,
    tickDecimals: 0,
  },
  series: {
    points: { show: true }
  }
});

//var pos = $.plot("#pos", posSeries);

var iterDemo = (function() {
  "use strict";
  var iter = 0;
  var timeout = 200; // milliseconds
  var step = timeout/1000.0;
  var tolerance = step / 2;
  var xstop;
  var d1, d2;

  function iterDemo(x) {
    var reset = false;
    var y1, y2;

    if (typeof x !== "undefined" && x !== null) {
      reset = true;
    }

    if (reset) {
      iter = 0;
      xstop = x;
      d1 = [[0, -2]];
      d2 = [[0, 4]];
    }
    iter = iter + step;
    Robot.printMessage(iter);
    y1 = 2 * iter - 2;
    y2 = 0.5 * iter + 4;
    d1.push([iter, y1]);
    d2.push([iter, y2]);

    xvstSeries[0].data = d1;
    xvstSeries[1].data = d2;
    posSeries[0].data = [[1, y1]];
    posSeries[1].data = [[1, y2]];
    xvst.setData(xvstSeries);
    pos.setData(posSeries);
    xvst.draw();
    pos.draw();
    if((xstop - iter) > (tolerance)) {
      setTimeout(iterDemo, timeout);
    }
  }

  return iterDemo;
})();

window.runDemo = function () {
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
};

}());
