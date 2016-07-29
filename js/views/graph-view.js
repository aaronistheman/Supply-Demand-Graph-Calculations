"use strict";

/**
 * View custom type in charge of the display of the data
 * in the stacked canvases of the webpage. Only involves canvas
 * drawing (sometimes of text).
 */
function GraphView() {
  if (!(this instanceof GraphView))
    alertAndThrowException("Forgot 'new' before GraphView constructor");
  
  this.mStoreElements();
} // GraphView

GraphView.prototype = {
  constructor : GraphView,
  
  /**
   * Stores canvas-related elements in this GraphView instance
   */
  mStoreElements : function() {
    this.mSupplyCanvas = $("#supply-graph")[0];
    this.mSupplyCtx = this.mSupplyCanvas.getContext('2d');
    Graph.applyGraphContextSettings(this.mSupplyCanvas, this.mSupplyCtx);

    this.mDemandCanvas = $("#demand-graph")[0];
    this.mDemandCtx = this.mDemandCanvas.getContext('2d');
    Graph.applyGraphContextSettings(this.mDemandCanvas, this.mDemandCtx);
  
    this.mAxesCanvas = $("#axes-graph")[0];
    this.mAxesCtx = this.mAxesCanvas.getContext('2d');
    Graph.applyAxesContextSettings(this.mAxesCanvas, this.mAxesCtx);
    
    this.mIndicatorCanvas = $("#graph-indicators")[0];
    this.mIndicatorCtx = this.mIndicatorCanvas.getContext('2d');
    Graph.applyGraphContextSettings(this.mIndicatorCanvas, this.mIndicatorCtx);
    
    this.mWpCanvas = $("#wp-canvas")[0];
    this.mWpCtx = this.mWpCanvas.getContext('2d');
    Graph.applyGraphContextSettings(this.mWpCanvas, this.mWpCtx);
  },
};

/**
 * "Static" variables for GraphView
 */

// These say how far the axes are from canvas edges
Graph.edgeOffsetX = 40;
Graph.edgeOffsetY = 40;

// Max values that can be seen on each axis
Graph.maxX = 150;
Graph.maxY = 1.80;



/**
 * "Static" methods for GraphView
 */
  
/**
 * Applies to ctx the adjustments appropriate for drawing
 * some sort of graph (e.g. demand, supply, some line for
 * clarification), but NOT the axes.
 * 
 * @param canvas
 * @param ctx the canvas' context
 */
Graph.applyGraphContextSettings = function(canvas, ctx) {
  ctx.translate(Graph.edgeOffsetX, canvas.height - Graph.edgeOffsetY);
  ctx.scale(1 / Graph.maxX, -1 / Graph.maxY);
};

/**
 * Applies to ctx the adjustments appropriate for drawing the
 * graph axes.
 *
 * @param canvas
 * @param ctx the canvas' context
 */
Graph.applyAxesContextSettings = function(canvas, ctx) {
  ctx.translate(Graph.edgeOffsetX, canvas.height - Graph.edgeOffsetY);
  ctx.scale(1, -1);
};