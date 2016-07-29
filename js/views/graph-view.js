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
    // Graph.mApplyContextSettings(this.mSupplyCanvas, this.mSupplyCtx);

    this.mDemandCanvas = $("#demand-graph")[0];
    this.mDemandCtx = this.mDemandCanvas.getContext('2d');
    // Graph.mApplyContextSettings(this.mDemandCanvas, this.mDemandCtx);
  
    this.mAxesCanvas = $("#axes-graph")[0];
    this.mAxesCtx = this.mAxesCanvas.getContext('2d');
    // this.mAxesCtx.translate(Graph.EDGE_OFFSET_X,
      // this.mAxesCanvas.height - Graph.EDGE_OFFSET_Y);
    // this.mAxesCtx.scale(1, -1);
    
    this.mIndicatorCanvas = $("#graph-indicators")[0];
    this.mIndicatorCtx = this.mIndicatorCanvas.getContext('2d');
    // Graph.mApplyContextSettings(this.mIndicatorCanvas, this.mIndicatorCtx);
    
    this.mWpCanvas = $("#wp-canvas")[0];
    this.mWpCtx = this.mWpCanvas.getContext('2d');
    // Graph.mApplyContextSettings(this.mWpCanvas, this.mWpCtx);
  },
};