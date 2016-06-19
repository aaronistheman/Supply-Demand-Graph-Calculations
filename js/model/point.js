"use strict";

/**
 * @param q instance of Quantity
 * @param p instance of Price
 */
function Point(q, p) {
  if (!(this instanceof Point))
    alertAndThrowException("Forgot 'new' before Point constructor");
  
  // Originally, Point took integers, so I have these checks here
  // to make sure I don't miss any Point constructor calls-to-change.
  if (!(q instanceof Quantity))
    alertAndThrowException("q isn't instance of Quantity");
  if (!(p instanceof Price))
    alertAndThrowException("p isn't instance of Price");
  
  this.q = q;
  this.p = p;
}