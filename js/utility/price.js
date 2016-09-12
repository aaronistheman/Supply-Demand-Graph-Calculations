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
    return Math.round(this.mVal * 100) / 100;
  },
  
  getUnrounded : function() {
    return this.mVal;
  },
  
  /**
   * Gets the price, but rounded and padded with zeroes (where needed),
   * as a string.
   */
  forDisplay : function() {
    return "$" + this.mVal.toFixed(2);
  },
  
  getForTesting : function() {
    return Price.getForTesting(this.mVal);
  },
};

/**
 * @return value of unroundedPriceValue rounded in the way a price would
 * be
 */
Price.get = function(unroundedPriceValue) {
  return Math.round(unroundedPriceValue * 100) / 100;
};

/**
 * @return unroundedPriceValue as a string in view-friendly way
 */
Price.forDisplay = function(unroundedPriceValue) {
  return "$" + unroundedPriceValue.toFixed(2);
};

/**
 * @return value of unroundedPriceValue rounded in a way that avoids
 * rounding errors during unit tests
 */
Price.getForTesting = function(unroundedPriceValue) {
  return Math.round(unroundedPriceValue * 1000) / 1000;
};