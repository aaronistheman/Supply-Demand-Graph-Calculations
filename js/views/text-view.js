"use strict";

/**
 * View custom type in charge of the display of the data
 * in the "panels" of the webpage. Involves no drawing.
 */
function TextView(industryName) {
  if (!(this instanceof TextView))
    alertAndThrowException("Forgot 'new' before TextView constructor");
  
  this.$title = $("#graph-title");
  this.$title.html(industryName);
  
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
  
  // For open economy
  this.$imports = $("#imports"); // number of imports
  this.$wp = $("#world-p"); // world price
  
  // For closed, public economy
  this.$taxDisplay = $("#tax-amount");
  this.$taxAmount = $("#new-tax-amount");
  this.$whatTaxed = $("#what-taxed");
  this.$subsidyDisplay = $("#subsidy-amount");
  this.$subsidyAmount = $("#new-subsidy-amount");
  this.$whatSubsidized = $("#what-subsidized");
  this.$pmAmount = $("#pm-amount");
} // TextView

TextView.prototype = {
  constructor : TextView,
  
  getWhatTaxed : function() {
    return this.$whatTaxed.val();
  },
  
  getTaxAmount : function() {
    return this.$taxAmount.val();
  },
  
  getWhatSubsidized : function() {
    return this.$whatSubsidized.val();
  },
  
  getSubsidyAmount : function() {
    return this.$subsidyAmount.val();
  },
  
  /**
   * @param data instance of EconomyModel
   */
  updateAll : function(data) {
    if (!(data instanceof EconomyModel))
      alertAndThrowException("data parameter is of wrong type");
    
    // equilibrium
    this.$eq.html(data.eq);
    this.$ep.html(Price.forDisplay(data.ep));
    
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
    
    // world price
    if (data.wp)
      this.$wp.html(Price.forDisplay(data.wp));
    else
      this.$wp.html("None");
    
    this.$imports.html(data.getNumberImports());
    
    // tax and subsidy info
    this.$taxDisplay.html(data.getTaxAmount());
    this.$subsidyDisplay.html(data.getSubsidyAmount());
    
    // price mechanism info
    this.$pmAmount.html(data.pmAmount);
  }, // updateAll()
};