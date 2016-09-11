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
   * @param offset value to apply to the obtained price
   */
  getP : function(q, offset=0) {
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
      return before.p() + offset + (q - before.q()) * slope;
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

      return this._points[this._points.length - 1].p() + offset;
    }
  }, // getP()
  
  /**
   * Gets a quantity associated with the given price. This is more
   * complicated then getP() because, although each quantity is mapped
   * to one price, each price may be mapped to multiple quantities.
   *
   * @pre there exists a quantity in the given range [startQ, endQ]
   * that matches the given price
   * @param price a Price value
   * @param startQ quantity value to start the point-by-point traversal at
   * @param endQ quantity value that is the last one that will be
   * traversed (e.g. last quantity in supply graph);
   * if endQ < startQ, then the traversal will go backwards (decreasing
   * quantity) instead of forwards (increasing quantity)
   * @param comparisonFunction is for deciding that the correct quantity
   * has been reached; the returned quantity is the quantity that
   * happens to be being examined when comparisonFunciton returns false
   * for the first time; its first argument is the price of the currently
   * examined point, and its second argument is the given argument price
   * @return Quantity value
   */
  getQ : function(price, startQ, endQ) {
    return undefined;
  },

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