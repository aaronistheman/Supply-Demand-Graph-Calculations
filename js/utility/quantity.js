"use strict";

/**
 * Wrapper type so I don't have to keep manually rounding the quantity
 */
function Quantity(val) {
  if (!(this instanceof Quantity))
    alertAndThrowException("Forgot 'new' before Quantity constructor");
  
  this.mVal = val;
}

Quantity.prototype = {
  constructor : Quantity,
  
  /**
   * Gets the quantity, but rounded as a quantity would be
   */
  get : function() {
    return Math.round(this.mVal);
  },
  
  getUnrounded : function() {
    return this.mVal;
  }
};

/**
 * @return value of unroundedQuantityValue rounded in the way
 * a quantity would be
 */
Quantity.get = function(unroundedQuantityValue) {
  return Math.round(unroundedQuantityValue);
};