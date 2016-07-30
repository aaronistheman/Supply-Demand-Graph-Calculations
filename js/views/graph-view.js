"use strict";

/**
 * View custom type in charge of the display of the data
 * in the stacked canvases of the webpage. Only involves canvas
 * drawing (sometimes of text).
 *
 * Much of the code regarding the labelling and "tick-marking" of
 * the axes is from "HTML5 Canvas Cookbook" by Eric Rowell.
 */
function GraphView() {
  if (!(this instanceof GraphView))
    alertAndThrowException("Forgot 'new' before GraphView constructor");
  
  this.mStoreElements();
  this.drawAxes(); // should only be done once
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
  }, // mStoreElements()
  
  /**
   * @param data instance of Data
   */
  updateAll : function(data) {
    if (!(data instanceof Data))
      alertAndThrowException("data parameter is of wrong type");
    
    this.redrawDemand(data.getDemand());
    this.redrawSupply(data.getSupply());
  },

  /**
   * Doesn't clean the canvas before drawing
   * @param points array of instances of Point
   */
  mDrawGraph : function(points, canvas, ctx) {
    // Move to the first point
    ctx.beginPath();
    ctx.moveTo(canvas.width * points[0].q(), canvas.height * points[0].p());
    for (var i in points) {
      ctx.lineTo(canvas.width * points[i].q(), canvas.height * points[i].p());
    }

    ctx.stroke();
  },

  /**
   * @param supply instance of PiecewiseFunction
   */
  redrawSupply : function(supply) {
    Graph.clearCanvas(this.mSupplyCanvas, this.mSupplyCtx);
    this.mDrawGraph(supply.getPoints(), this.mSupplyCanvas,
      this.mSupplyCtx);
  },

  /**
   * @param demand instance of PiecewiseFunction
   */
  redrawDemand : function(demand) {
    Graph.clearCanvas(this.mDemandCanvas, this.mDemandCtx);
    this.mDrawGraph(demand.getPoints(), this.mDemandCanvas,
      this.mDemandCtx);
  },
  
  drawAxes : function() {
    this.mDrawXAxis();
    this.mDrawYAxis();
  },
  
  mDrawXAxis : function() {
    this.mAxesCtx.beginPath();
    
    // the x-axis line
    this.mAxesCtx.moveTo(0, 0);
    this.mAxesCtx.lineTo(this.mAxesCanvas.width, 0);
    
    // draw tick marks
    for (var i = 1; i <= Graph.numTicksX; i++) {
      this.mAxesCtx.moveTo(i * this.mAxesCanvas.width /
        Graph.numGapsX, -1 * Graph.halfTick);
      this.mAxesCtx.lineTo(i * this.mAxesCanvas.width /
        Graph.numGapsX, Graph.halfTick);
    }

    // draw labels
    this.mAxesCtx.save();
    this.mAxesCtx.scale(1, -1);
    this.mAxesCtx.textAlign = "center";
    this.mAxesCtx.textBaseline = "middle";
    for (var i = 1; i <= Graph.numTicksX; i++) {
      var label = Math.round(i * Graph.maxX / Graph.numGapsX);
      this.mAxesCtx.fillText(label,
        i * this.mAxesCanvas.width / Graph.numGapsX,
        Graph.labelOffset);
    }
    this.mAxesCtx.restore();
    
    this.mAxesCtx.stroke();
  },
  
  mDrawYAxis : function() {
    this.mAxesCtx.beginPath();
    
    // the line
    this.mAxesCtx.moveTo(0, 0);
    this.mAxesCtx.lineTo(0, this.mAxesCanvas.height);

    // draw tick marks
    for (var i = 1; i <= Graph.numTicksY; i++) {
      this.mAxesCtx.moveTo(-1 * Graph.halfTick, i * this.mAxesCanvas.height /
        Graph.numGapsY);
      this.mAxesCtx.lineTo(Graph.halfTick, i * this.mAxesCanvas.height /
        Graph.numGapsY);
    }

    // draw labels
    this.mAxesCtx.save();
    this.mAxesCtx.scale(1, -1); // so that text isn't upside down
    this.mAxesCtx.textAlign = "center";
    this.mAxesCtx.textBaseline = "middle";
    for (var i = 1; i <= Graph.numTicksY; i++) {
      // Because y-axis represents money amount
      var label = (Math.round(i * Graph.maxY * 100 /
        Graph.numGapsY) / 100).toFixed(2);

      this.mAxesCtx.fillText(label,
        -Graph.labelOffset,
        -i * this.mAxesCanvas.height / Graph.numGapsY);
    }
    this.mAxesCtx.restore();
    
    this.mAxesCtx.stroke();
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

// For drawing axes
Graph.numTicksX = 5; // a tick is a little line perpendicular to axis
Graph.numTicksY = 5;
Graph.numGapsX = Graph.numTicksX + 1;
Graph.numGapsY = Graph.numTicksY + 1;
Graph.tickLength = 10;
Graph.halfTick = Graph.tickLength / 2;

Graph.dashLength = 10;

// each tick usually has a label near it (e.g. 1.20)
Graph.labelOffset = 20; // how far label is from respective axis

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

/**
 * This method is needed because of the context offset.
 * @pre the cleared canvas has been set up with Graph._applyContextSettings()
 */
Graph.clearCanvas = function(canvas, ctx) {
  ctx.beginPath();
  ctx.clearRect(-1 * Graph.edgeOffsetX * Graph.maxX,
    -1 * Graph.edgeOffsetY * Graph.maxY,
    canvas.width * Graph.maxX,
    canvas.height * Graph.maxY);
};