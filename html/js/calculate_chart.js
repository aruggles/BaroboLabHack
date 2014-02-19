$(function() {
"use strict";

var copSeries = {
    data: [[-2, -6], [6, 10]],
    color: "blue",
};

var robberSeries = {
    data: [[-4, 2], [8, 8]],
    color: "red",
};

var xline = {
    data: [[4, 0], [4, 6]],
    color: "#8a8a8a"
};

var yline = {
    data: [[0, 6], [4, 6]],
    color: "#8a8a8a"
};


$.plot("#calculation_chart", [xline, yline, robberSeries, copSeries], {
    grid: {
        markings: [
            { linewidth: 1, yaxis: { from: 0, to: 0 }, color: "#8A8A8A" },
            { linewidth: 1, xaxis: { from: 0, to: 0 }, color: "#8A8A8A" },
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
});

});
