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
    
    $("#b-world-p").click(function() { // if changing world price
      var wp = $("#world-p").val();
      
      if (wp < eq.y) {
        graph.setWp(wp);
        graph.redrawWorldPriceLine();
        
        var qd = Math.round(graph.getQd());
        $("#qd").html(qd);
        var qs = Math.round(graph.getQs());
        $("#qs").html(qs);
        
        state = STATE.SHORTAGE;
        $("#state").html(state);
        
        // number of imports
        $("#imports").html(qd - qs);
      }
      else {
        alert("Because the developer wasn't particularly " +
          "knowledgeable about economics, a set world " +
          "price must be below the equilibrium price. His apologies.");
      }
    }); // if changing world price
    
    $("#closed-open-checkbox").change(function() { // if toggling checkbox
      if (this.checked) { // if closing economy
        graph.setWp(undefined);
        graph.redrawWorldPriceLine();
        
        var qd = Math.round(graph.getQd());
        $("#qd").html(qd);
        var qs = Math.round(graph.getQs());
        $("#qs").html(qs);
        
        state = STATE.EQUILIBRIUM;
        $("#state").html(state);
        $("#imports").html(0);
      }
    }); // if toggling closed/open checkbox
    
  } // if not unit testing
}); // document ready function