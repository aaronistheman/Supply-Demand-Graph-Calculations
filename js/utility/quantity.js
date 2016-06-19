"use strict";

/**
 * Wrapper type so I don't have to keep manually rounding the quantity
 */
function Quantity(val) {
  this.mVal = val;
}

Quantity.prototype = {
  constructor : Quantity,
  
  /**
   * Gets the quantity, but rounded as a quantity would be
   */
  get : function() {
    return Math.round(val);
  },
};