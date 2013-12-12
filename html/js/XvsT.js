var iterDemo = (function() {
  var iter = 0;
  var timeout = 200; // milliseconds

  function iterDemo() {
    iter = iter + timeout/1000.0;
    var d1 = [];
    d1.push([0, 4])
    d1.push([iter, 0.5*iter+4]);
    var d2 = [];
    d2.push([0, -2])
    d2.push([iter, 2*iter-2]);

    var d3 = [];
    d3.push([6, 10]); // Just to make sure the graph stays the right size
    $.plot("#placeholder", [ d1, d2, d3 ]);
    if(iter < 4) {
      setTimeout(iterDemo, timeout);
    }
  }

  return iterDemo;
})();

function runDemo() {
  var intersectGuess = $("intersect").value;
  if (typeof Robot !== 'undefined' && Robot !== null) {
    var wheelradius = 1.75;   // inches
    var robotList = Robot.getRobotIDList();
    var red = "BKWT";
    var blue = "KCXS";
    Robot.connectRobot(red);
    Robot.connectRobot(blue);

    var redfunc = function(x) {
      return 0.5 * x + 4;
    }

    var bluefunc = function(x) {
      return 2 * x - 2;
    }

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
    iterDemo();
  }
}
