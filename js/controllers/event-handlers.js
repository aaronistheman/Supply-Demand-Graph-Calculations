"use strict";

function EventHandlers() {
  this.setUpAllHandlers();
} // EventHandlers()

EventHandlers.prototype = {
  constructor : EventHandlers,
  
  setUpAllHandlers : function() {
    $("#b-world-p").click(EventHandlers.worldPriceHandler);
  },
};

EventHandlers.worldPriceHandler = function() {
  alert("Changing world price");
};