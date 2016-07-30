"use strict";


$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "30 1.25 ; 90 0.75 ; 110 0.30";
    var data = new Data(supplyPoints, demandPoints);
    
    var textView = new TextView();
    textView.updateAll(data);
    
    var graphView = new GraphView();
    graphView.updateAll(data);
    
    var eventHandlers = new EventHandlers();
    eventHandlers.setUpAllHandlers(data);
    
    /**
     * Set up event handlers. Should be simplified by the
     * controller type(s).
     */
    
    /*
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
    */
    
  } // if not unit testing
}); // document ready function