"use strict";

function EventHandlers() {
  if (!(this instanceof EventHandlers))
    alertAndThrowException("Forgot 'new' before EventHandlers constructor");
} // EventHandlers()

EventHandlers.prototype = {
  constructor : EventHandlers,
  
  /**
   * @param data instance of Data
   */
  setUpAllHandlers : function(data) {
    $("#b-world-p").click(function() {
      EventHandlers.worldPriceHandler(data);
    });
  },
};

EventHandlers.worldPriceHandler = function(data) {
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