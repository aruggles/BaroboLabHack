robots = ['8KV7', '6C19']

angular.module('explore', [])
    .controller('Explore', ($scope) ->
        $scope.mockRobot = Robot.mock? && Robot.mock
    )
    .controller('StandardEqns', ($scope) ->
        $scope.selected = [0,0]

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

        $scope.changeSelected = (robot, left) ->
            if left
                if $scope.selected[robot] > 0
                    $scope.selected[robot] -= 1

            else
                if $scope.selected[robot] < 2
                    $scope.selected[robot] += 1

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

        $scope.plotChart = ->
            serieses =
                for [a, b] in [[$scope.a1, $scope.b1],
                               [$scope.a2, $scope.b2]]
                    for x in [-10, 10]
                        [x, a*x + b]
            $.plot($(".chartGoesHere", $element), serieses, chartCfg)


        $('.chartGoesHere', $element).height("400px").width("400px")

        $scope.$watch(
            -> [ $scope.a1, $scope.b1 ,
                 $scope.a2, $scope.b2 ]
            $scope.plotChart
            true
        )
    )

# Without this, the chart on the hidden tab draws funny. Perhaps because it
# is hidden, and some size information is wrong? Anyway, this ensures the
# chart is redrawn after the tab is visible -- and thus drawn correctly.
$('a[data-toggle="tab"]').on('shown.bs.tab', (ev) ->
    # Gets the scope of the chart div.
    s = $('.chartGoesHere', $(ev.target).attr("href")).scope()
    s.plotChart()
)

##
## Set up mock robot if necessary
##

Robot =
    if Robot?
        Robot
    else
        rb = { mock: true }
        (rb[x] = ->) for x in [
            "connectRobot",
            "disconnectRobot",
            "getRobotIDList",
            "moveNB",
            "printMessage",
            "setColorRGB",
            "setJointSpeeds",
            "stop",
        ]
        (rb[event] = { connect: -> }) for event in [
            "scrollUp"
            "scrollDown"
            "buttonChanged"
        ]

        rb


##
## Bracket robot connections.
##

Robot.connectRobot(x) for x in robots
Robot.setColorRGB(robots[0], 255, 0, 0)
Robot.setColorRGB(robots[1], 0, 0, 255)

window.onbeforeunload = ->
    Robot.setColorRGB(robots[0], 0, 255, 0)
    Robot.setColorRGB(robots[1], 0, 255, 0)
    Robot.disconnectRobot(x) for x in robots
    null

Robot.buttonChanged.connect((id, btn) ->
    ###
    if it's the right robot, change the input field of the left eqn on the
    active pane.

    What is the active pane? Well we can get that with

    activeTab = $("tab-pane active").scope().

    Then we want the 

    ###
    activeTab = $(".tab-pane.active")

    activeTab.scope().changeSelected(
        robots.indexOf(id)
        (btn == 0)
    )
)
Robot.scrollDown.connect((id) ->
)
Robot.scrollUp.connect((id) ->
)
