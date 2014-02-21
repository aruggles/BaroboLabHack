angular.module('explore', [])
    .controller('StandardEqns', ($scope) ->
        $scope.x1 = -1
        $scope.y1 = 2
        $scope.z1 = 8

        $scope.x2 = -2
        $scope.y2 = 1
        $scope.z2 = -2

        $scope.a1 = $scope.a2 = $scope.b1 = $scope.b2 = 0

        $scope.$watch(
            ->
                [$scope.x1, $scope.y1, $scope.z1,
                 $scope.x2, $scope.y2, $scope.z2]
            ->
                $scope.a1 = -$scope.x1/$scope.y1
                $scope.b1 =  $scope.z1/$scope.y1
                $scope.a2 = -$scope.x2/$scope.y2
                $scope.b2 =  $scope.z2/$scope.y2
            true
        )
    )
    .controller('InterceptEqns', ($scope) ->
        $scope.a1 = 0.5
        $scope.b1 = 4
        $scope.a2 = 2
        $scope.b2 = -2
    )
    .controller('Graph', ($scope, $element) ->
        chartCfg = {
            grid: {
                markings: [
                    {
                      linewidth: 1
                      yaxis: { from: 0, to: 0 }
                      color: "#8A8A8A"
                    }
                    {
                      linewidth: 1
                      xaxis: { from: 0, to: 0 }
                      color: "#8A8A8A"
                    }
                ],
            },
            xaxis: {
              min: -10,
              max: 10,
              tickSize: 2,
              tickDecimals: 0,
            },
            yaxis: {
              min: -10,
              max: 10,
              tickSize: 2,
              tickDecimals: 0,
            },
            colors: ["red", "blue"]
        }


        $('.chartGoesHere', $element).height("400px").width("400px")

        $scope.$watch(
            -> [ $scope.a1, $scope.b1 ,
                 $scope.a2, $scope.b2 ]
            ->
                serieses =
                    for [a, b] in [[$scope.a1, $scope.b1],
                                   [$scope.a2, $scope.b2]]
                        for x in [-10, 10]
                            [x, a*x + b]
                $.plot($(".chartGoesHere", $element), serieses, chartCfg)
            true
        )
    )
