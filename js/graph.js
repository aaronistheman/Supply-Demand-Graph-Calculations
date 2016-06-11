"use strict";

/**
 * Graph custom type that's specifically for this project but
 * perhaps has general use.
 *
 * Note that the beginPath method of the canvas context is sometimes
 * called seemingly randomly, to clear the canvas' strokes
 * (so clearRect() would do something).
 *
 * Much of the code regarding the labelling and "tick-marking" of
 * the axes is from "HTML5 Canvas Cookbook" by Eric Rowell.
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
  this._axesCtx.translate(Graph.OFFSET_X,
    this._axesCanvas.height - Graph.OFFSET_Y);
  this._axesCtx.scale(1, -1);
} // Graph constructor

/**
 * "Static" variables for Graph
 */

// These say how far the axes are from canvas edges
Graph.OFFSET_X = 30;
Graph.OFFSET_Y = 30;

// These will hopefully be removed
Graph.MAX_X = 150;
Graph.MAX_Y = 1.80;

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

    /**
     * x-axis
     */
    
    // the line
    this._axesCtx.moveTo(0, 0);
    this._axesCtx.lineTo(this._axesCanvas.width, 0);
    
    // draw labels
    this._axesCtx.save();
    this._axesCtx.scale(1, -1);
    this._axesCtx.textAlign = "center";
    this._axesCtx.textBaseline = "middle";
    for (var i = 1; i < 6; i++) {
      var label = Math.round(i * Graph.MAX_X / 6);
      this._axesCtx.fillText(label,
        i * this._axesCanvas.width / 6,
        10);
    }
    this._axesCtx.restore();

    /**
     * y-axis
     */

    // the line
    this._axesCtx.moveTo(0, 0);
    this._axesCtx.lineTo(0, this._axesCanvas.height);
    
    // draw labels
    this._axesCtx.save();
    this._axesCtx.scale(1, -1);
    this._axesCtx.textAlign = "center";
    this._axesCtx.textBaseline = "middle";
    for (var i = 1; i < 6; i++) {
      var label = Math.round(i * Graph.MAX_Y / 6);
      this._axesCtx.fillText(label,
        -10,
        -i * this._axesCanvas.height / 6);
    }
    this._axesCtx.restore();

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