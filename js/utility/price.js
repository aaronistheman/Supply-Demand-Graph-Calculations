"use strict";

/**
 * Wrapper type so I don't have to keep manually rounding the price
 */
function Price(val) {
  if (!(this instanceof Price))
    alertAndThrowException("Forgot 'new' before Price constructor");
  
  this.mVal = val;
}

Price.prototype = {
  constructor : Price,
  
  /**
   * Gets the price, but rounded as a price would be (i.e. to nearest
   * hundreth)
   */
  get : function() {
    return Math.round(val * 100) / 100;
  },
};