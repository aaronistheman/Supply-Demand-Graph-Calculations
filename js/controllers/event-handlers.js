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
  alert(data.qd);
};