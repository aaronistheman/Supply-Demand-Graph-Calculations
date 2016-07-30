"use strict";

/**
 * Deals with the event handlers that let the user emphasize
 * certain aspects of the graph. Should only modify a view,
 * never a model.
 */
function EmphasisController() {
  if (!(this instanceof EmphasisController))
    alertAndThrowException(
      "Forgot 'new' before EmphasisController constructor");
} // EmphasisController()

EmphasisController.prototype = {
  constructor : EmphasisController,
  
  /**
   * @param data instance of EconomyModel
   */
  setUpAllHandlers : function(data) {
    
  },
};