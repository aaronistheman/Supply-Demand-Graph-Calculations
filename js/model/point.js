"use strict";

/**
 * @param q number
 * @param p number
 */
function Point(q, p) {
  if (!(this instanceof Point))
    alertAndThrowException("Forgot 'new' before Point constructor");
  
  this.mQ = new Quantity(q);
  this.mP = new Price(p);
}

Point.prototype = {
  constructor : Point,
  
  // returns Quantity value
  q : function() {
    return this.mQ.get();
  },
  
  // returns price value
  p : function() {
    return this.mP.get();
  },
  
  // returns Quantity instance
  quantity : function() {
    return this.mQ;
  },
  
  // returns Price instance
  price : function() {
    return this.mP;
  },
};