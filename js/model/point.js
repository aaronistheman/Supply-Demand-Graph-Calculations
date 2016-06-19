"use strict";

/**
 * @param q number
 * @param p number
 */
function Point(q, p) {
  if (!(this instanceof Point))
    alertAndThrowException("Forgot 'new' before Point constructor");
  
  this.q = new Quantity(q);
  this.p = new Price(p);
}