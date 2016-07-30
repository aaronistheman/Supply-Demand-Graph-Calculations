"use strict";

/**
 * Note that the beginPath method of the canvas context is sometimes
 * called seemingly randomly, to clear the canvas' strokes
 * (so clearRect() would do something).
 */
function Graph(supplyDataString, demandDataString) {
  if (!(this instanceof Graph))
    return new Graph();

  
  this._wp = undefined; // world price
  
  // Stuff that involves a webpage and are not needed by unit test
  if (!isUnitTesting()) {
  
    // set graph title
    $("#graph-title").html("Glue");
    
    this.emphasizeLowestQuantity();
    this.emphasizeEquilibriumQuantity();
  } // if not unit testing
} // Graph constructor

/**
 * This method is needed because of the context offset.
 * @pre the cleared canvas has been set up with Graph._applyContextSettings()
 */
Graph._clearCanvas = function(canvas, ctx) {
  ctx.beginPath();
  ctx.clearRect(-Graph.EDGE_OFFSET_X * Graph.MAX_X,
    -Graph.EDGE_OFFSET_Y * Graph.MAX_Y,
    canvas.width * Graph.MAX_X,
    canvas.height * Graph.MAX_Y);
};

/**
 * Methods for Graph
 */
Graph.prototype = {
  constructor : Graph,
  
  /**
   * Accessors and mutators
   */
  
  
  /**
   * Sets world price, but also updates quantities.
   */
  setWp : function(newWp) {
    this._wp = newWp;
    
    if (!isUnitTesting()) {
      if (this._wp !== undefined)
        this._updateWorldQuantities();
      else {
        this._eqPoint = this.calculateEquilibriumPoint();
        this._qd = this._qs = this._eqPoint.x;
      }
    }
  },
  
  /**
   * Other methods
   */

  /**
   * @return the quantity demanded at the current world price
   */
  determineWorldQD : function() {
    if (this._wp < this._dPoints[this._dPoints.length - 1].y)
      alertAndThrowException("World price causes extrapolation " +
        "on demand data")

    var range = this._dPoints[this._dPoints.length - 1].x - this._eqPoint.x;
    var step = range / Graph.NUM_RECTANGLES;
    var x = this._eqPoint.x;
    var price = this._demand.getY(x);
    
    // Go forward from equilibrium point until price would become
    // lower than world price,
    // at which point the method would stop and return the current quantity
    while (price > this._wp) {
      // advance
      x += step;
      price = this._demand.getY(x);
    }
    
    return x;
  },

  /**
   * @return the quantity supplied at the current world price
   */
  determineWorldQS : function() {
    if (this._wp < this._sPoints[0].y)
      alertAndThrowException("World price causes extrapolation " +
        "on supply data")

    var range = this._eqPoint.x - this._sPoints[0].x;
    var step = range / Graph.NUM_RECTANGLES;
    var x = this._eqPoint.x;
    var price = this._supply.getY(x);
    
    // Go backward from equilibrium point until price would become
    // lower than world price,
    // at which point the method would stop and return the current quantity
    while (price > this._wp) {
      // advance
      x -= step;
      price = this._supply.getY(x);
    }
    
    return x;
  },
  
  _updateWorldQuantities : function() {
    this._qd = this.determineWorldQD();
    this._qs = this.determineWorldQS();
  },
  
  /**
   * Server as eraser method if world price is undefined
   */
  redrawWorldPriceLine : function() {
    Graph._clearCanvas(this._wpCanvas, this._wpCtx);
  
    if (this._wp !== undefined) {
      var ctx = this._wpCtx;
      var y = this._wp * this._wpCanvas.height;
      ctx.moveTo(0, y);
      ctx.lineTo(Graph.MAX_X * this._wpCanvas.width, y);
      ctx.stroke();
    }
  },
  
  /**
   * Emphasizes where the lowest quantity used for calculations
   * is on the canvas (with a dashed line).
   */
  emphasizeLowestQuantity : function() {
    this._indicatorCtx.moveTo(this._lowestQuantity *
      this._indicatorCanvas.width, 0);
    var isDrawingDash = true;
    
    for (var y = 0; y < this._indicatorCanvas.height;
      y += Graph.DASH_LENGTH) {
      if (isDrawingDash) {
        this._indicatorCtx.lineTo(this._lowestQuantity *
          this._indicatorCanvas.width, Graph.MAX_Y * y);
      }
      else { // not drawing dash
        this._indicatorCtx.moveTo(this._lowestQuantity *
          this._indicatorCanvas.width, Graph.MAX_Y * y);
      }
      
      isDrawingDash = !isDrawingDash;
    }
      
    this._indicatorCtx.stroke();
  }, // emphasizeLowestQuantity()
  
  emphasizeEquilibriumQuantity : function() {
    this._indicatorCtx.moveTo(this._eqPoint.x *
      this._indicatorCanvas.width, 0);
    var isDrawingDash = true;
    
    for (var y = 0; y < this._indicatorCanvas.height;
      y += Graph.DASH_LENGTH) {
      if (isDrawingDash) {
        this._indicatorCtx.lineTo(this._eqPoint.x *
          this._indicatorCanvas.width, Graph.MAX_Y * y);
      }
      else { // not drawing dash
        this._indicatorCtx.moveTo(this._eqPoint.x *
          this._indicatorCanvas.width, Graph.MAX_Y * y);
      }
      
      isDrawingDash = !isDrawingDash;
    }
      
    this._indicatorCtx.stroke();
  }, // emphasizeHighestQuantity()

  /**
   * Doesn't clean the canvas before drawing
   * @param points array of instances of Point
   */
  _drawGraph : function(points, canvas, ctx) {
    // Move to the first point
    ctx.beginPath();
    ctx.moveTo(canvas.width * points[0].x, canvas.height * points[0].y);
    for (var i in points) {
      ctx.lineTo(canvas.width * points[i].x, canvas.height * points[i].y);
    }

    ctx.stroke();
  },

  redrawSupply : function() {
    Graph._clearCanvas(this._supplyCanvas, this._supplyCtx);
    this._drawGraph(this._supply.getPoints(), this._supplyCanvas,
      this._supplyCtx);
  },

  redrawDemand : function() {
    Graph._clearCanvas(this._demandCanvas, this._demandCtx);
    this._drawGraph(this._demand.getPoints(), this._demandCanvas,
      this._demandCtx);
  },
};