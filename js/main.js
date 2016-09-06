"use strict";


$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    // var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    // var demandPoints = "30 1.25 ; 90 0.75 ; 110 0.30 ; 120 0.15";
    // var data = new EconomyModel(supplyPoints, demandPoints);
    var data = getLinearGraph2();
    // var data = getComplicatedGraph1();
    
    var textView = new TextView("Glue");
    textView.updateAll(data);
    
    var graphView = new GraphView();
    graphView.updateAll(data);
    
    var settingsController = new SettingsController();
    settingsController.setUpAllHandlers(data, textView, graphView);
  } // if not unit testing
}); // document ready function