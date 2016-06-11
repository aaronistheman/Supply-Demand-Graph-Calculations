"use strict";

function Graph(supplyDataString, demandDataString) {
  if (!(this instanceof Graph))
    return new Graph();

  this._supply = new PiecewiseFunction();
  Graph._readFunctionData(this._supply, supplyDataString);

  this._demand = new PiecewiseFunction();
  Graph._readFunctionData(this._demand, demandDataString);

  this._canvas = document.getElementById("graph");
  this._ctx = this._canvas.getContext('2d');

  // Canvas context settings
  this._ctx.translate(Graph.OFFSET_X, this._canvas.height - Graph.OFFSET_Y);
  this._ctx.scale(1 / Graph.MAX_X, -1 / Graph.MAX_Y);
}

/**
 * "Static" members for Graph
 */

// These say how far the axes are from canvas edges
Graph.OFFSET_X = 10;
Graph.OFFSET_Y = 10;

// These will hopefully be removed
Graph.MAX_X = 120;
Graph.MAX_Y = 1.50;


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
 * Methods for Graph
 */
Graph.prototype = {
  constructor : Graph,

  drawAxes : function() {
    // x-axis
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(this._canvas.width * Graph.MAX_X, 0);

    // y-axis
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(0, this._canvas.height * Graph.MAX_Y);

    this._ctx.stroke();
  },

  /**
   * Doesn't clean the canvas before drawing
   * @param points array of instances of Point
   */
  _drawGraph : function(points) {
    // Move to the first point
    this._ctx.moveTo(this._canvas.width * points[0].x,
      this._canvas.height * points[0].y);
    for (var i in points) {
      this._ctx.lineTo(this._canvas.width * points[i].x,
        this._canvas.height * points[i].y);
    }

    this._ctx.stroke();
  },

  redrawSupply : function() {
    this._drawGraph(this._supply.getPoints());
  },

  redrawDemand : function() {
    this._drawGraph(this._demand.getPoints());
  },
};