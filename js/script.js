"use strict";

$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "30 1.25 ; 90 0.75 ; 110 0.30";

    var graph = new Graph(supplyPoints, demandPoints);
    graph.drawAxes();
    graph.redrawSupply();
    graph.redrawDemand();
    
    var eq = graph.getEquilibriumPoint();
    document.getElementById("eq-q").innerHTML = Math.round(eq.x);
    document.getElementById("eq-p").innerHTML =
      (Math.round(eq.y * 100) / 100).toFixed(2);
    
    var tr = graph.getTotalRevenue();
    document.getElementById("total-rev").innerHTML =
      (Math.round(tr * 100) / 100).toFixed(2);
      
    var cs = graph.getConsumerSurplus();
    document.getElementById("con-s").innerHTML =
      (Math.round(cs * 100) / 100).toFixed(2);
    
    var ps = graph.getProducerSurplus();
    document.getElementById("pro-s").innerHTML =
      (Math.round(ps * 100) / 100).toFixed(2);
    
    var es = cs + ps;
    document.getElementById("eco-s").innerHTML =
      (Math.round(es * 100) / 100).toFixed(2);
  } // if not unit testing
}); // document ready function