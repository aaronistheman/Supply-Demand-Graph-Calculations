"use strict";

/**
 * @param q number
 * @param p number
 */
function Point(q, p) {
  if (!(this instanceof Point))
    alertAndThrowException("Forgot 'new' before Point constructor");
  
  // I've gotten some cryptic error messages due to passing parameters
  // of the wrong type to this constructor, so let's solve that problem
  if (q instanceof Quantity)
    alertAndThrowException(
      "Point constructor doesn't take Quantity instance");
  if (p instanceof Price)
    alertAndThrowException(
      "Point constructor doesn't take Price instance");
  
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