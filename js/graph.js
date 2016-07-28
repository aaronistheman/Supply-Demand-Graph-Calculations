"use strict";

/**
 * Graph custom type that's specifically for this project but
 * perhaps has general use.
 *
 * Note that the beginPath method of the canvas context is sometimes
 * called seemingly randomly, to clear the canvas' strokes
 * (so clearRect() would do something).
 *
 * Regarding the methods that use Riemann sums: the number of rectangles
 * and the use of rounding, in my opinion, make which Riemann sum
 * (e.g. right, left, midpoint) I use unimportant.
 *
 * Much of the code regarding the labelling and "tick-marking" of
 * the axes is from "HTML5 Canvas Cookbook" by Eric Rowell.
 *
 * @param supplyDataString should have following format:
 * "quantity price ; quantity price ; quantity price", with
 * increasing quantities; (see unit tests for examples)
 * @param demandDataString see immediately above
 */
function Graph(supplyDataString, demandDataString) {
  if (!(this instanceof Graph))
    return new Graph();

  this._supply = new PiecewiseFunction();
  Graph._readFunctionData(this._supply, supplyDataString);
  
  this._demand = new PiecewiseFunction();
  Graph._readFunctionData(this._demand, demandDataString);
  
  // Store references to the point arrays
  this._sPoints = this._supply.getPoints();
  this._dPoints = this._demand.getPoints();
  
  this._lowestQuantity = this.calculateLowestQuantity();
  this._highestQuantity = this.calculateHighestQuantity();
  
  this._eqPoint = this.calculateEquilibriumPoint();
  this._qd = this._eqPoint.x;
  this._qs = this._eqPoint.x;
  
  this._wp = undefined; // world price
  
  // Stuff that involves a webpage and are not needed by unit test
  if (!isUnitTesting()) {
    this._setUpCanvases();
  
    // set graph title
    $("#graph-title").html("Glue");
    
    this.emphasizeLowestQuantity();
    this.emphasizeEquilibriumQuantity();
  } // if not unit testing
} // Graph constructor

/**
 * "Static" variables for Graph
 */

// These say how far the axes are from canvas edges
Graph.EDGE_OFFSET_X = 40;
Graph.EDGE_OFFSET_Y = 40;

Graph.MAX_X = 150;
Graph.MAX_Y = 1.80;

Graph.NUM_TICKS_X = 5;
Graph.NUM_TICKS_Y = 5;
Graph.NUM_GAPS_X = Graph.NUM_TICKS_X + 1;
Graph.NUM_GAPS_Y = Graph.NUM_TICKS_Y + 1;
Graph.TICK_LENGTH = 10;
Graph.HALF_TICK = Graph.TICK_LENGTH / 2;

Graph.DASH_LENGTH = 10;

Graph.LABEL_OFFSET = 20; // how far label is from respective axis

Graph.NUM_RECTANGLES = 100000; // usually for Riemann sums

/**
 * "Static" methods for Graph
 */

Graph._applyContextSettings = function(canvas, ctx) {
  ctx.translate(Graph.EDGE_OFFSET_X, canvas.height - Graph.EDGE_OFFSET_Y);
  ctx.scale(1 / Graph.MAX_X, -1 / Graph.MAX_Y);
};

/**
 * @param func instance of PiecewiseFunction, but isn't requirement
 * @param dataString properly formatted string (e.g. "40 0.25; 50 0.30")
 * of ordered pairs (intended for (quantity, price) pairs)
 */
Graph._readFunctionData = function(func, dataString) {
  var q = -1;
  var p = -1;
  var qString = "";
  var pString = "";
  var qArray = [];
  var pArray = [];
  var sin = new StringInput(dataString);

  while (!sin.isAtEnd()) {
    // get q
    sin.ignore(' ');
    qString = sin.getCharsUntil(' ');
    q = parseFloat(qString);

    // get p
    sin.ignore(' ');
    pString = sin.getCharsUntil(' ');
    p = parseFloat(pString);

    // ignore until semi-colon (or reach end)
    sin.ignore(' ');
    sin.ignore(';');

    func.insert(new Point(q, p));
  }
}; // readFunctionData()

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
  
  getEquilibriumPoint : function() {
    return this._eqPoint;
  },
  
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
  
  getQd : function() {
    return this._qd;
  },
  
  getQs : function() {
    return this._qs;
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
  
  _setUpCanvases : function() {
    this._supplyCanvas = $("#supply-graph")[0];
    this._supplyCtx = this._supplyCanvas.getContext('2d');
    Graph._applyContextSettings(this._supplyCanvas, this._supplyCtx);

    this._demandCanvas = $("#demand-graph")[0];
    this._demandCtx = this._demandCanvas.getContext('2d');
    Graph._applyContextSettings(this._demandCanvas, this._demandCtx);
  
    this._axesCanvas = $("#axes-graph")[0];
    this._axesCtx = this._axesCanvas.getContext('2d');
    this._axesCtx.translate(Graph.EDGE_OFFSET_X,
      this._axesCanvas.height - Graph.EDGE_OFFSET_Y);
    this._axesCtx.scale(1, -1);
    
    this._indicatorCanvas = $("#graph-indicators")[0];
    this._indicatorCtx = this._indicatorCanvas.getContext('2d');
    Graph._applyContextSettings(this._indicatorCanvas, this._indicatorCtx);
    
    this._wpCanvas = $("#wp-canvas")[0];
    this._wpCtx = this._wpCanvas.getContext('2d');
    Graph._applyContextSettings(this._wpCanvas, this._wpCtx);
  }, // setUpCanvases()
  
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
  
  _drawXAxis : function() {
    this._axesCtx.beginPath();
    
    // the line
    this._axesCtx.moveTo(0, 0);
    this._axesCtx.lineTo(this._axesCanvas.width, 0);
    
    // draw tick marks
    for (var i = 1; i <= Graph.NUM_TICKS_X; i++) {
      this._axesCtx.moveTo(i * this._axesCanvas.width /
        Graph.NUM_GAPS_X, -Graph.HALF_TICK);
      this._axesCtx.lineTo(i * this._axesCanvas.width /
        Graph.NUM_GAPS_X, Graph.HALF_TICK);
    }

    // draw labels
    this._axesCtx.save();
    this._axesCtx.scale(1, -1);
    this._axesCtx.textAlign = "center";
    this._axesCtx.textBaseline = "middle";
    for (var i = 1; i <= Graph.NUM_TICKS_X; i++) {
      var label = Math.round(i * Graph.MAX_X / Graph.NUM_GAPS_X);
      this._axesCtx.fillText(label,
        i * this._axesCanvas.width / Graph.NUM_GAPS_X,
        Graph.LABEL_OFFSET);
    }
    this._axesCtx.restore();
    
    this._axesCtx.stroke();
  }, // _drawXAxis()
  
  _drawYAxis : function() {
    this._axesCtx.beginPath();
    
    // the line
    this._axesCtx.moveTo(0, 0);
    this._axesCtx.lineTo(0, this._axesCanvas.height);

    // draw tick marks
    for (var i = 1; i <= Graph.NUM_TICKS_Y; i++) {
      this._axesCtx.moveTo(-Graph.HALF_TICK, i * this._axesCanvas.height /
        Graph.NUM_GAPS_Y);
      this._axesCtx.lineTo(Graph.HALF_TICK, i * this._axesCanvas.height /
        Graph.NUM_GAPS_Y);
    }

    // draw labels
    this._axesCtx.save();
    this._axesCtx.scale(1, -1); // so that text isn't upside down
    this._axesCtx.textAlign = "center";
    this._axesCtx.textBaseline = "middle";
    for (var i = 1; i <= Graph.NUM_TICKS_Y; i++) {
      // Because y-axis represents money amount
      var label = (Math.round(i * Graph.MAX_Y * 100 /
        Graph.NUM_GAPS_Y) / 100).toFixed(2);

      this._axesCtx.fillText(label,
        -Graph.LABEL_OFFSET,
        -i * this._axesCanvas.height / Graph.NUM_GAPS_Y);
    }
    this._axesCtx.restore();
    
    this._axesCtx.stroke();
  }, // _drawYAxis()

  drawAxes : function() {
    this._drawXAxis();
    this._drawYAxis();
  },

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
  
  getEconomicSurplus : function() {
    return this.getConsumerSurplus() + this.getProducerSurplus();
  },
};