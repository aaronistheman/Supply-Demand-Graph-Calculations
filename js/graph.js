"use strict";

/**
 * Note that the beginPath method of the canvas context is sometimes
 * called seemingly randomly, to clear the canvas' strokes
 * (so clearRect() would do something).
 */
function Graph(supplyDataString, demandDataString) {
  if (!(this instanceof Graph))
    return new Graph();

  
  this._wp = undefined; // world price
  
  // Stuff that involves a webpage and are not needed by unit test
  if (!isUnitTesting()) {
  
    // set graph title
    $("#graph-title").html("Glue");
    
    this.emphasizeLowestQuantity();
    this.emphasizeEquilibriumQuantity();
  } // if not unit testing
} // Graph constructor

/**
 * Methods for Graph
 */
Graph.prototype = {
  constructor : Graph,
  
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

  
};