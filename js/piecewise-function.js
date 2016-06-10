"use strict";


function Point(x, y) {
  if (!(this instanceof Point)) // if user forgot "new"
    return new Point(x, y);

  this.x = x;
  this.y = y;
}

function PiecewiseFunction() {
  if (!(this instanceof PiecewiseFunction)) // if user forgot "new"
    return new PiecewiseFunction();

  this._points = []; // array of instances of Point
}

/**
 * Methods for PiecewiseFunction
 */
PiecewiseFunction.prototype = {
  constructor : PiecewiseFunction,

  getY : function(x) {

  },

  /**
   * @param point instance of Point
   */
  insert : function(point) {
    if (this._points.length > 0) { // error-checking
      var lastPoint = this._points[this._points.length - 1];
      if (point.x < lastPoint.x) // if point would make array unsorted
        alertAndThrowException("tried inserting point that'd break sort");
    }

    // made it past error-checking
    this._points.push(point);
  },
};