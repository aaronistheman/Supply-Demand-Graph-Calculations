"use strict";

var STATE = {
  EQUILIBRIUM : "Equilibrium",
  SHORTAGE : "Shortage",
  SURPLUS : "Surplus",
};

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
    $("#eq-q").html(Math.round(eq.x));
    $("#eq-p").html((Math.round(eq.y * 100) / 100).toFixed(2));
    
    var tr = graph.getTotalRevenue();
    $("#total-rev").html((Math.round(tr * 100) / 100).toFixed(2));
      
    var cs = graph.getConsumerSurplus();
    $("#con-s").html((Math.round(cs * 100) / 100).toFixed(2));
    
    var ps = graph.getProducerSurplus();
    $("#pro-s").html((Math.round(ps * 100) / 100).toFixed(2));
    
    var es = cs + ps;
    $("#eco-s").html((Math.round(es * 100) / 100).toFixed(2));
    
    var state = STATE.EQUILIBRIUM;
    $("#state").html(state);
    if (state == STATE.EQUILIBRIUM) {
      $("#qd").html(Math.round(eq.x));
      $("#qs").html(Math.round(eq.x));
    }
    
    $("#b-world-p").click(function() {
      alert("redrawing");
      
      var wp = $("#world-p").val();
      graph.setWp(wp);
      
      // redraw line
      graph.redrawWorldPriceLine();
      
      if (wp < eq.y) {
        alert("wp < eq.y");
        
        // qd
        
        
        // qs
        
        
        // state
        
        
        // number of imports
        
        
      }
    });
  } // if not unit testing
}); // document ready function