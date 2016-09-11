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
  
  this.mStoreElements(); // <-- A list of members is in this method.
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
    GraphView.applyGraphContextSettings(this.mSupplyCanvas, this.mSupplyCtx);

    this.mDemandCanvas = $("#demand-graph")[0];
    this.mDemandCtx = this.mDemandCanvas.getContext('2d');
    GraphView.applyGraphContextSettings(this.mDemandCanvas, this.mDemandCtx);
  
    this.mAxesCanvas = $("#axes-graph")[0];
    this.mAxesCtx = this.mAxesCanvas.getContext('2d');
    GraphView.applyAxesContextSettings(this.mAxesCanvas, this.mAxesCtx);
    
    this.mIndicatorCanvas = $("#graph-indicators")[0];
    this.mIndicatorCtx = this.mIndicatorCanvas.getContext('2d');
    GraphView.applyGraphContextSettings(this.mIndicatorCanvas,
      this.mIndicatorCtx);
    
    this.mWpCanvas = $("#wp-canvas")[0];
    this.mWpCtx = this.mWpCanvas.getContext('2d');
    GraphView.applyGraphContextSettings(this.mWpCanvas, this.mWpCtx);
    
    this.mPmCanvas = $("#pm-canvas")[0];
    this.mPmCtx = this.mPmCanvas.getContext('2d');
    GraphView.applyGraphContextSettings(this.mPmCanvas, this.mPmCtx);
  }, // mStoreElements()
  
  /**
   * @param data instance of EconomyModel
   */
  updateAll : function(data) {
    if (!(data instanceof EconomyModel))
      alertAndThrowException("data parameter is of wrong type");
    
    this.redrawDemand(data.getDemand(), data.getDemandVerticalOffset());
    this.redrawSupply(data.getSupply(), data.getSupplyVerticalOffset());
    
    // Emphasize certain values with solid line
    this.redrawWorldPriceLine(data.wp);
    this.redrawPriceMechanismLine(data.pmAmount);
    
    // Emphasize certain values with dashed line
    GraphView.clearCanvas(this.mIndicatorCanvas, this.mIndicatorCtx);
    this.mEmphasizeQuantityDashedLine(data.getLowestEffectiveQuantity());
    this.mEmphasizeQuantityDashedLine(data.eq);
  },

  /**
   * Doesn't clean the canvas before drawing
   * @param points array of instances of Point
   * @param canvas
   * @param ctx (is restored before function ends)
   * @param color of type string (e.g. "red")
   * @param offset how much to add to a point's price when plotting it
   */
  mDrawGraph : function(points, canvas, ctx, color, offset=0) {
    // set up context
    ctx.save();
    ctx.strokeStyle = color; // apply color
    ctx.lineWidth = 5;
    
    // Move to the first point
    ctx.beginPath();
    ctx.moveTo(canvas.width * points[0].q(),
      canvas.height * (points[0].p() + offset));
    for (var i in points) {
      ctx.lineTo(canvas.width * points[i].q(),
        canvas.height * (points[i].p() + offset));
    }

    ctx.stroke();
    ctx.restore();
  },

  /**
   * @param supply instance of PiecewiseFunction
   */
  redrawSupply : function(supply, verticalOffset=0) {
    GraphView.clearCanvas(this.mSupplyCanvas, this.mSupplyCtx);
    this.mDrawGraph(supply.getPoints(), this.mSupplyCanvas,
      this.mSupplyCtx, "red");
      
    // if need an offset supply graph, too
    if (verticalOffset != 0) {      
      this.mDrawGraph(supply.getPoints(), this.mSupplyCanvas,
        this.mSupplyCtx, "blue", verticalOffset);
    }
  },

  /**
   * @param demand instance of PiecewiseFunction
   */
  redrawDemand : function(demand, verticalOffset=0) {
    GraphView.clearCanvas(this.mDemandCanvas, this.mDemandCtx);
    this.mDrawGraph(demand.getPoints(), this.mDemandCanvas,
      this.mDemandCtx, "black");
    
    // if need an offset demand graph, too
    if (verticalOffset != 0) {
      this.mDrawGraph(demand.getPoints(), this.mDemandCanvas,
        this.mDemandCtx, "blue", verticalOffset);
    }
  },
  
  /**
   * Services as erased method if price mechanism is undefined
   * @param pm value of the price mechanism
   */
  redrawPriceMechanismLine : function(pm) {
    GraphView.clearCanvas(this.mPmCanvas, this.mPmCtx);
  
    if (pm) {
      var ctx = this.mPmCtx;
      var y = pm * this.mPmCanvas.height;
      ctx.moveTo(0, y);
      ctx.lineTo(GraphView.maxX * this.mPmCanvas.width, y);
      ctx.stroke();
    }
  },
  
  /**
   * Serves as eraser method if world price is undefined
   * @param worldPrice value of the world price
   */
  redrawWorldPriceLine : function(worldPrice) {
    GraphView.clearCanvas(this.mWpCanvas, this.mWpCtx);
  
    if (worldPrice) {
      var ctx = this.mWpCtx;
      var y = worldPrice * this.mWpCanvas.height;
      ctx.moveTo(0, y);
      ctx.lineTo(GraphView.maxX * this.mWpCanvas.width, y);
      ctx.stroke();
    }
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
    for (var i = 1; i <= GraphView.numTicksX; i++) {
      this.mAxesCtx.moveTo(i * this.mAxesCanvas.width /
        GraphView.numGapsX, -1 * GraphView.halfTick);
      this.mAxesCtx.lineTo(i * this.mAxesCanvas.width /
        GraphView.numGapsX, GraphView.halfTick);
    }

    // draw labels
    this.mAxesCtx.save();
    this.mAxesCtx.scale(1, -1);
    this.mAxesCtx.textAlign = "center";
    this.mAxesCtx.textBaseline = "middle";
    for (var i = 1; i <= GraphView.numTicksX; i++) {
      var label = Math.round(i * GraphView.maxX / GraphView.numGapsX);
      this.mAxesCtx.fillText(label,
        i * this.mAxesCanvas.width / GraphView.numGapsX,
        GraphView.labelOffset);
    }
    this.mAxesCtx.restore();
    
    this.mAxesCtx.stroke();
  }, // mDrawXAxis()
  
  mDrawYAxis : function() {
    this.mAxesCtx.beginPath();
    
    // the y-axis line
    this.mAxesCtx.moveTo(0, 0);
    this.mAxesCtx.lineTo(0, this.mAxesCanvas.height);

    // draw tick marks
    for (var i = 1; i <= GraphView.numTicksY; i++) {
      this.mAxesCtx.moveTo(-1 * GraphView.halfTick, i *
        this.mAxesCanvas.height / GraphView.numGapsY);
      this.mAxesCtx.lineTo(GraphView.halfTick, i * this.mAxesCanvas.height /
        GraphView.numGapsY);
    }

    // draw labels
    this.mAxesCtx.save();
    this.mAxesCtx.scale(1, -1); // so that text isn't upside down
    this.mAxesCtx.textAlign = "center";
    this.mAxesCtx.textBaseline = "middle";
    for (var i = 1; i <= GraphView.numTicksY; i++) {
      // Because y-axis represents money amount
      var label = (Math.round(i * GraphView.maxY * 100 /
        GraphView.numGapsY) / 100).toFixed(2);

      this.mAxesCtx.fillText(label,
        -GraphView.labelOffset,
        -i * this.mAxesCanvas.height / GraphView.numGapsY);
    }
    this.mAxesCtx.restore();
    
    this.mAxesCtx.stroke();
  }, // mDrawYAxis()
  
  /**
   * Emphasizes the given quantity with a dashed line parallel to
   * the y-axis. Doesn't clear the indicator canvas, in case this
   * method is used to emphasize multiple quantities.
   * @param q the quantity value to emphasize
   */
  mEmphasizeQuantityDashedLine : function(q) {
    this.mIndicatorCtx.moveTo(q * this.mIndicatorCanvas.width, 0);
    var isDrawingDash = true;
    
    // Starting from the x-axis, draw vertical dashes until reached top
    for (var y = 0; y < this.mIndicatorCanvas.height;
      y += GraphView.dashLength) {
      if (isDrawingDash) {
        // draw dash
        this.mIndicatorCtx.lineTo(q *
          this.mIndicatorCanvas.width, GraphView.maxY * y);
      }
      else { // not drawing dash
        // skip drawing dash here
        this.mIndicatorCtx.moveTo(q *
          this.mIndicatorCanvas.width, GraphView.maxY * y);
      }
      
      isDrawingDash = !isDrawingDash;
    }
      
    this.mIndicatorCtx.stroke(); // finalize the drawing
  }, // mEmphasizeQuantityDashedLine
};

/**
 * "Static" variables for GraphView
 */

// These say how far the axes are from canvas edges
GraphView.edgeOffsetX = 40;
GraphView.edgeOffsetY = 40;

// Max values that can be seen on each axis
GraphView.maxX = 150;
GraphView.maxY = 1.80;

// For drawing axes
GraphView.numTicksX = 5; // a tick is a little line perpendicular to axis
GraphView.numTicksY = 5;
GraphView.numGapsX = GraphView.numTicksX + 1;
GraphView.numGapsY = GraphView.numTicksY + 1;
GraphView.tickLength = 10;
GraphView.halfTick = GraphView.tickLength / 2;

GraphView.dashLength = 10; // for drawing dashed lines

// each tick usually has a label near it (e.g. 1.20)
GraphView.labelOffset = 20; // how far label is from respective axis

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
GraphView.applyGraphContextSettings = function(canvas, ctx) {
  ctx.translate(GraphView.edgeOffsetX, canvas.height - GraphView.edgeOffsetY);
  ctx.scale(1 / GraphView.maxX, -1 / GraphView.maxY);
};

/**
 * Applies to ctx the adjustments appropriate for drawing the
 * graph axes.
 *
 * @param canvas
 * @param ctx the canvas' context
 */
GraphView.applyAxesContextSettings = function(canvas, ctx) {
  ctx.translate(GraphView.edgeOffsetX, canvas.height - GraphView.edgeOffsetY);
  ctx.scale(1, -1);
};

/**
 * This method is needed because of the context offset.
 * @pre the cleared canvas' context has been set up
 */
GraphView.clearCanvas = function(canvas, ctx) {
  ctx.beginPath();
  ctx.clearRect(-1 * GraphView.edgeOffsetX * GraphView.maxX,
    -1 * GraphView.edgeOffsetY * GraphView.maxY,
    canvas.width * GraphView.maxX,
    canvas.height * GraphView.maxY);
};