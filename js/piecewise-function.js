"use strict";


function Point(x, y) {
  if (!(this instanceof Point)) // if user forgot "new"
    return new Point(x, y);

  this.x = x;
  this.y = y;
}

/**
 * General piecewise function custom type that also facilitates
 * integral approximations (via Riemann sums)
 */
function PiecewiseFunction() {
  if (!(this instanceof PiecewiseFunction)) // if user forgot "new"
    return new PiecewiseFunction();

  this._points = []; // array of instances of Point

  // For Riemann sums
  this._numRectangles = 500000;
}

/**
 * Methods for PiecewiseFunction
 */
PiecewiseFunction.prototype = {
  constructor : PiecewiseFunction,

  setNumRectangles : function(num) {
    this._numRectangles = num;
  },

  getY : function(x) {
    if (x < this._points[0].x
      || x > this._points[this._points.length - 1])
      alertAndThrowException("x out of range");

    // find the first point below x and first point above it
    var before = null;
    var after = null;
    var afterIndex;
    for (afterIndex = 1; afterIndex < this._points.length
      && this._points[afterIndex].x < x; ++afterIndex)
      ;

    if (afterIndex < this._points.length) { // if didn't reach end
      before = this._points[afterIndex - 1];
      after = this._points[afterIndex];

      var slope = (after.y - before.y) / (after.x - before.x);
      return before.y + (x - before.x) * slope;
    }
    else {
      /**
       * Note: because of the earlier range check, this "should"
       * never happen, but JavaScript has imperfect comparison
       * of floating-point numbers (e.g. 1.450000000000000000016 > 1.45
       * returns false); however, this coincidentally allows me to
       * here make a fix regarding the possibility of Riemann sums
       * going a little bit outside of range
       */

      return this._points[this._points.length - 1].y;
    }
  }, // getY()

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

  getLeftRiemannSum : function(lowerBound, upperBound) {
    var range = upperBound - lowerBound;
    var step = range / this._numRectangles;
    var answer = 0;

    // Execute the summation
    for (var x = lowerBound, i = 0; i < this._numRectangles;
      x += step, ++i)
      answer += this.getY(x) * step;

    return answer;
  },

  getRightRiemannSum : function(lowerBound, upperBound) {
    var range = upperBound - lowerBound;
    var step = range / this._numRectangles;
    var answer = 0;

    // Execute the summation
    for (var x = lowerBound + step, i = 0; i < this._numRectangles;
      x += step, ++i)
      answer += this.getY(x) * step;

    return answer;
  },
};