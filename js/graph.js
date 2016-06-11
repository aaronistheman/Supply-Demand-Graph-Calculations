"use strict";

function Graph() {
  if (!(this instanceof Graph))
    return new Graph();

  this._demand = new PiecewiseFunction();
  this._supply = new PiecewiseFunction();

  this._canvas = document.getElementById("graph");
  this._ctx = this._canvas.getContext('2d');
}

/**
 * "Static" members for Graph
 */
Graph.OFFSET_X = 10;
Graph.OFFSET_Y = 10;

/**
 * Methods for Graph
 */
Graph.prototype = {
  constructor : Graph,

  drawAxes : function() {
    this._ctx.moveTo(Graph.OFFSET_X, this._canvas.height - Graph.OFFSET_Y);
    this._ctx.lineTo(this._canvas.width, this._canvas.height - Graph.OFFSET_Y);
    this._ctx.moveTo(Graph.OFFSET_X, this._canvas.height - Graph.OFFSET_Y);
    this._ctx.lineTo(Graph.OFFSET_X, 0);
    this._ctx.stroke();
  },
};