"use strict";

/**
 * Custom type that allows the obtaining of points not explicitly
 * specified by the user
 */
function PiecewiseFunction() {
  if (!(this instanceof PiecewiseFunction)) // if user forgot "new"
    alertAndThrowException(
      "Forgot 'new' before PiecewiseFunction constructor");

  this._points = []; // array of instances of Point
}

/**
 * Methods for PiecewiseFunction
 */
PiecewiseFunction.prototype = {
  constructor : PiecewiseFunction,

  setNumRectangles : function(num) {
    this._numRectangles = num;
  },

  getPoints : function() {
    return this._points;
  },
  
  /**
   * @param q just the quantity value (NOT instance of Quantity)
   */
  getP : function(q) {
    if (q < this._points[0].q()
      || q > this._points[this._points.length - 1].q())
      alertAndThrowException("x out of range");

    // find the first point below x and first point above it
    var before = null;
    var after = null;
    var afterIndex; // needed after for loop
    // afterIndex will have index of first point above x
    for (afterIndex = 1; afterIndex < this._points.length
      && this._points[afterIndex].q() < q; ++afterIndex)
      ;

    if (afterIndex < this._points.length) { // if didn't reach end
      before = this._points[afterIndex - 1];
      after = this._points[afterIndex];

      // Get the slope between the two points, then use that slope
      // to approximate/interpolate what the price-to-return is
      var slope = (after.p() - before.p()) / (after.q() - before.q());
      return before.p() + (q - before.q()) * slope;
    }
    else {
      /**
       * Note: because of the earlier range check, this "should"
       * never happen, but JavaScript has imperfect comparison
       * of floating-point numbers (e.g. 1.450000000000000000016 > 1.45
       * returns false); however, this coincidentally allows me to
       * here make a fix regarding the possibility of Riemann sums
       * going a little bit outside of range.
       */

      return this._points[this._points.length - 1].p();
    }
  }, // getP()

  /**
   * @param point instance of Point
   */
  insert : function(point) {
    // error-checking
    if (this._points.length > 0) {
      var lastPoint = this._points[this._points.length - 1];
      if (point.q() < lastPoint.q()) // if point would make array unsorted
        alertAndThrowException("tried inserting point that'd break sort");
    }

    // made it past error-checking
    this._points.push(point);
  },
};