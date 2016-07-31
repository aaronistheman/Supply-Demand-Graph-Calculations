"use strict";

/**
 * View custom type in charge of the display of the data
 * in the "panels" of the webpage. Involves no drawing.
 */
function TextView() {
  if (!(this instanceof TextView))
    alertAndThrowException("Forgot 'new' before TextView constructor");
  
  // store the display-related HTML elements
  this.$eq = $("#eq-q"); // equilibrium quantity display
  this.$ep = $("#eq-p"); // equilibrium price display
  this.$tr = $("#total-rev");
  this.$cs = $("#con-s"); // consumer surplus
  this.$ps = $("#pro-s"); // producer surplus
  this.$es = $("#eco-s"); // economic surplus
  this.$state = $("#state");
  this.$qd = $("#qd"); // quantity demanded
  this.$qs = $("#qs"); // quantity supply
  this.$imports = $("#imports"); // number of imports
} // TextView

TextView.prototype = {
  constructor : TextView,
  
  /**
   * @param data instance of EconomyModel
   */
  updateAll : function(data) {
    if (!(data instanceof EconomyModel))
      alertAndThrowException("data parameter is of wrong type");
    
    // equilibrium
    this.$eq.html(data.eq);
    this.$ep.html(data.ep);
    
    // domestic quantity breakdown
    this.$qd.html(data.qd);
    this.$qs.html(data.qs);
    var state = data.getState();
    this.$state.html(state);
    
    this.$tr.html(data.getTotalRevenue().forDisplay());
    
    // welfare measurements
    var cs = data.getConsumerSurplus();
    this.$cs.html(cs.forDisplay());
    var ps = data.getProducerSurplus();
    this.$ps.html(ps.forDisplay());
    var es = data.getEconomicSurplus(cs, ps);
    this.$es.html(es.forDisplay());
    
    this.$imports.html(data.getNumberImports());
  },
};