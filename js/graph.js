"use strict";

/**
 * Graph custom type that's specifically for this project but
 * perhaps has general use.
 *
 * Note that the beginPath method of the canvas context is sometimes
 * called seemingly randomly, to clear the canvas' strokes
 * (so clearRect() would do something).
 */
function Graph(supplyDataString, demandDataString) {
  if (!(this instanceof Graph))
    return new Graph();

  this._supply = new PiecewiseFunction();
  Graph._readFunctionData(this._supply, supplyDataString);
  this._supplyCanvas = document.getElementById("supply-graph");
  this._supplyCtx = this._supplyCanvas.getContext('2d');
  Graph._applyContextSettings(this._supplyCanvas, this._supplyCtx);

  this._demand = new PiecewiseFunction();
  Graph._readFunctionData(this._demand, demandDataString);
  this._demandCanvas = document.getElementById("demand-graph");
  this._demandCtx = this._demandCanvas.getContext('2d');
  Graph._applyContextSettings(this._demandCanvas, this._demandCtx);

  this._axesCanvas = document.getElementById("axes-graph");
  this._axesCtx = this._axesCanvas.getContext('2d');
  Graph._applyContextSettings(this._axesCanvas, this._axesCtx);
} // Graph constructor

/**
 * "Static" variables for Graph
 */

// These say how far the axes are from canvas edges
Graph.OFFSET_X = 10;
Graph.OFFSET_Y = 10;

// These will hopefully be removed
Graph.MAX_X = 120;
Graph.MAX_Y = 1.50;

/**
 * "Static" methods for Graph
 */

Graph._applyContextSettings = function(canvas, ctx) {
  ctx.translate(Graph.OFFSET_X, canvas.height - Graph.OFFSET_Y);
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
  ctx.clearRect(-Graph.OFFSET_X * Graph.MAX_X,
    -Graph.OFFSET_Y * Graph.MAX_Y,
    canvas.width * Graph.MAX_X,
    canvas.height * Graph.MAX_Y);
};

/**
 * Methods for Graph
 */
Graph.prototype = {
  constructor : Graph,

  drawAxes : function() {
    this._axesCtx.beginPath();

    // x-axis
    this._axesCtx.moveTo(0, 0);
    this._axesCtx.lineTo(this._axesCanvas.width * Graph.MAX_X, 0);

    // y-axis
    this._axesCtx.moveTo(0, 0);
    this._axesCtx.lineTo(0, this._axesCanvas.height * Graph.MAX_Y);

    this._axesCtx.stroke();
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
};