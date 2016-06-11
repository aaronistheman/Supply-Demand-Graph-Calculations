"use strict";

$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 80 0.75 ; 110 0.25";

    var graph = new Graph(supplyPoints, demandPoints);
    graph.drawAxes();
    // graph.redrawSupply();
    // graph.redrawDemand();
  }
}); // document ready function