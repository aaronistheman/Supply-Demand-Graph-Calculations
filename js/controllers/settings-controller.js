"use strict";

/**
 * Deals with the event handlers that allow the user to change
 * the economic model.
 */
function SettingsController() {
  if (!(this instanceof SettingsController))
    alertAndThrowException(
      "Forgot 'new' before SettingsController constructor");
} // SettingsController()

SettingsController.prototype = {
  constructor : SettingsController,
  
  /**
   * @param economyModel instance of EconomyModel
   * @param textView instance of TextView
   * @param graphView instance of GraphView
   */
  setUpAllHandlers : function(economyModel, textView, graphView) {
    $("#b-world-p").click(function() {
      SettingsController.newWorldPriceHandler(
        economyModel, textView, graphView);
    });
    $("#closed-open-checkbox").change(function() {
      SettingsController.closingEconomyHandler(
        economyModel, textView, graphView, this);
    });
  },
};

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.newWorldPriceHandler =
  function(economyModel, textView, graphView) {
  var newWp = parseFloat($("#new-wp").val());
  
  if (!newWp || newWp < economyModel.ep) { // if valid input that I can handle
    try {
      economyModel.setWp(newWp);
      
      textView.updateAll(economyModel);
      graphView.updateAll(economyModel);
    }
    catch(err) {
      if (err == "demand extrapolation")
        alert("User Error: World price causes extrapolation " +
          "on demand data, so no changes made.")
      else if (err == "supply extrapolation")
        alert("User Error: World price causes extrapolation " +
          "on supply data, so no changes made.")
      else
        throw err;
    }
  }
  else { // if valid input that I can't handle
    alert("User Error: Because the developer wasn't particularly " +
          "knowledgeable about economics, a set world " +
          "price must be below the equilibrium price. His apologies.");
  }
}; // newWorldPriceHandler()

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 * @param checkbox the HTML checkbox element that was acted on
 */
SettingsController.closingEconomyHandler =
  function(economyModel, textView, graphView, checkbox) {
  if (checkbox.checked) { // if checked the box to close economy
    economyModel.setWp(undefined);
    textView.updateAll(economyModel);
    graphView.updateAll(economyModel);
  }
}; // closingEconomyHandler()