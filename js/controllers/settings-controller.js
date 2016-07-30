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
   * @param data instance of Data
   */
  setUpAllHandlers : function(data) {
    $("#b-world-p").click(function() {
      SettingsController.worldPriceHandler(data);
    });
  },
};

SettingsController.worldPriceHandler = function(data) {
  var newWp = parseFloat($("#world-p").val());
  
  if (isNaN(newWp)) { // if numbern not given
    alert("Error: world price must be numerical value");
  }
  else if (newWp < data.ep) { // if valid input that I can handle
    // update model
    

    // update view here? or should model do it?
    
  }
  else { // if valid input that I can't handle
    alert("Error: because the developer wasn't particularly " +
          "knowledgeable about economics, a set world " +
          "price must be below the equilibrium price. His apologies.");
  }
};