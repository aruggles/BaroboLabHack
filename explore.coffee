angular.module('explore', [])
    .controller('Eqns', ($scope) ->
        $scope.x1 = -1
        $scope.y1 = 2
        $scope.z1 = 8

        $scope.x2 = -2
        $scope.y2 = 1
        $scope.z2 = -2
    )
    .controller('Graph', ($scope) ->
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


        $('#chartGoesHere').height("400px").width("400px")

        $scope.$watch(
            -> [[$scope.x1, $scope.y1, $scope.z1],
                [$scope.x2, $scope.y2, $scope.z2]]
            ->
                serieses = for [x, y, z] in [[$scope.x1, $scope.y1, $scope.z1],
                                             [$scope.x2, $scope.y2, $scope.z2]]
                    a = -x/y
                    b = z/y
                    [x, a*x + b] for x in [-10, 10]
                $.plot("#chartGoesHere", serieses, chartCfg)
        )
    )
