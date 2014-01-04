/* global Robot */
function ChallengeControl ($scope) {
  "use strict";
  $scope.connect = function () {
    Robot.connectRobot("T3VV");
    Robot.connectRobot("X769");
  };

  $scope.discon = function () {
    Robot.disconnectRobot("T3VV");
    Robot.disconnectRobot("X769");
  };

  Robot.buttonChanged.connect(function(robID, btn) {
    if (robID === "T3VV") {
      $scope.check($scope.number1);
    }
    else {
      $scope.check($scope.number2);
    }
  });

  Robot.scrollUp.connect(function(robID) {
    alert(robID);
    if (robID === "T3VV") {
      $scope.number1.val = 3;
    }
    else {
      $scope.number2.val = 5;
    }
  });

  Robot.scrollDown.connect(function(robID) {
    alert("Yes");
    if (robID === "T3VV") {
      $scope.number1.val--;
      if ($scope.number1.val <= 1) {
        $scope.number1.val = 1;
      }
    }
    else {
      $scope.number2.val--;
      if ($scope.number2.val <= 1) {
        $scope.number2.val = 1;
      }
    }
  });

  function isPrime (n) {
      var i;
      if (n <= 1) {
          return false;
      }

      for (i = 2; i * i <= Math.sqrt(n); ++i) {
          if (0 === n % i) {
              return false;
          }
      }

      return true;
  }

  function giveMeNumber () {
    var num = Math.floor(Math.random() * 96 + 4);
    while (isPrime(num)) {
      num = Math.floor(Math.random() * 96 + 4);
    }

    return num;
  }

  $scope.topNumber = {
    val: giveMeNumber(),
    factored: []
  };

  $scope.number1 = {
    id: 1,
    sibling: 2,
    disabled: false,
    val: 1,
  };
  $scope.number2 = {
    id: 2,
    sibling: 1,
    disabled: false,
    val: 1,
  };

  $scope.check = function (num) {
    if (typeof $scope.topNumber.factored[0] !== "undefined" &&
            $scope.topNumber.factored[0].id !== num.id) {
      if ($scope.topNumber.factored[0].val * num.val === $scope.topNumber.val) {
        alert("Success");
        num.disabled = true;
      }
      else {
        alert("Fail, you failure");
      }
    }
    else { // first guess
      if (num.val <= 1) {
        alert("1 is a silly guess");
      }
      else {
        if ($scope.topNumber.val % num.val === 0) {
          $scope.topNumber.factored.push(num);
          alert("Success -- now waiting for teammate");
          num.disabled = true;
        }
        else {
          alert("Guess again!");
        }
      }
    }
  };

  $scope.disClass = function (num) {
    if (num.disabled === true) {
      return "disabled";
    }
  };

  $scope.connect();

}
