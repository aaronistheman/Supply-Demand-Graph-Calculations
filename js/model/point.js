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
  
  q : function() {
    return this.mQ.get();
  },
  
  p : function() {
    return this.mP.get();
  },
};