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
  
  // Stuff that involves a webpage and are not needed by unit test
  if (!isUnitTesting()) {
    this._supplyCanvas = document.getElementById("supply-graph");
    this._supplyCtx = this._supplyCanvas.getContext('2d');
    Graph._applyContextSettings(this._supplyCanvas, this._supplyCtx);

    this._demandCanvas = document.getElementById("demand-graph");
    this._demandCtx = this._demandCanvas.getContext('2d');
    Graph._applyContextSettings(this._demandCanvas, this._demandCtx);
  
    this._axesCanvas = document.getElementById("axes-graph");
    this._axesCtx = this._axesCanvas.getContext('2d');
    this._axesCtx.translate(Graph.EDGE_OFFSET_X,
      this._axesCanvas.height - Graph.EDGE_OFFSET_Y);
    this._axesCtx.scale(1, -1);
    
    this._indicatorCanvas = document.getElementById("graph-indicators");
    this._indicatorCtx = this._indicatorCanvas.getContext('2d');
    Graph._applyContextSettings(this._indicatorCanvas, this._indicatorCtx);
  
    // set graph title
    document.getElementById("graph-title").innerHTML = "Glue";
    
    this.emphasizeLowestQuantity();
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
 * This method is needed because of the context offset
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
  
  getEquilibriumPoint : function() {
    return this._eqPoint;
  },
  
  /**
   * @returns the lowest quantity that can be used for calculations
   * (i.e. the maximum of the two quantities of the lowest
   * demand and supply points)
   */
  calculateLowestQuantity : function() {
    // Get first supply point quantity
    var sLow = this._sPoints[0].x;
    
    // Get first demand point quantity
    var dLow = this._dPoints[0].x;
    
    if (sLow > dLow)
      return sLow;
    else
      return dLow;
  }, // calculateLowestQuantity()
  
  /**
   * @returns the highest quantity that can be used for
   * calculations (i.e. the minimum of the two quantities of the
   * highest demand and supply points)
   */
  calculateHighestQuantity : function() {
    // Get last supply point quantity
    var sHigh = this._sPoints[this._sPoints.length - 1].x;
    
    // Get last demand point quantity
    var dHigh = this._dPoints[this._dPoints.length - 1].x;
    
    if (sHigh > dHigh)
      return dHigh;
    else
      return sHigh;
  }, // calculateHighestQuantity()
  
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
  
  getTotalRevenue : function() {
    return this._eqPoint.x * this._eqPoint.y;
  },
  
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
  
  /**
   * @return a new Point instance representing where the supply and
   * demand graphs (first) intersect
   */
  calculateEquilibriumPoint : function() {
    var range = this._highestQuantity - this._lowestQuantity;
    var step = range / Graph.NUM_RECTANGLES;
    var x = this._lowestQuantity;
    var d = this._demand.getY(x);
    var s = this._supply.getY(x);
    var oldD = d;
    var oldS = s;
    
    // find the intersection of D and S graphs
    while (d > s && x <= this._highestQuantity) {
      oldD = d;
      oldS = s;
      
      x += step;
      d = this._demand.getY(x);
      s = this._supply.getY(x);
    }
    
    if (x > this._highestQuantity)
      alertAndThrowException("Supply and demand don't intersect");
    
    // The equilibrium point should be right before D becomes below S,
    // although this is highly unlikely to matter
    return new Point(x, oldD);
  }, // calculateEquilibriumPoint()
  
  /**
   * Consumer surplus is the integral from lowest quantity
   * to the equilibrium
   * quantity of the difference between demand and the equilibrium
   * price.
   */
  getConsumerSurplus : function() {
    var range = this._eqPoint.x - this._lowestQuantity;
    var step = range / Graph.NUM_RECTANGLES;
    var answer = 0;
    
    // Execute the summation
    for (var x = this._lowestQuantity + step, i = 0;
      i < Graph.NUM_RECTANGLES; x += step, ++i)
    {
      answer += (this._demand.getY(x) - this._eqPoint.y) * step;
    }
    
    return answer;
  },
  
  /**
   * Producer surplus is the integral from lowest quantity
   * to the equilibrium quantity of the difference between
   * the equilibrium price and supply.
   */
  getProducerSurplus : function() {
    var range = this._eqPoint.x - this._lowestQuantity;
    var step = range / Graph.NUM_RECTANGLES;
    var answer = 0;
    
    // Execute the summation
    for (var x = this._lowestQuantity + step, i = 0;
      i < Graph.NUM_RECTANGLES; x += step, ++i)
    {
      answer += (this._eqPoint.y - this._supply.getY(x)) * step;
    }
    
    return answer;
  },
  
  getEconomicSurplus : function() {
    return this.getConsumerSurplus() + this.getProducerSurplus();
  },
};