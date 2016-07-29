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
} // TextView

TextView.prototype = {
  constructor : TextView,
  
  /**
   * @param data instance of Data
   */
  updateAll : function(data) {
    if (!(data instanceof Data))
      alertAndThrowException("data parameter is of wrong type");
    
    this.$eq.html(data.eq);
    this.$ep.html(data.ep);
    
    this.$tr.html(data.getTotalRevenue().forDisplay());
    
    var cs = data.getConsumerSurplus();
    this.$cs.html(cs.forDisplay());
    var ps = data.getProducerSurplus();
    this.$ps.html(ps.forDisplay());
    var es = data.getEconomicSurplus(cs, ps);
    this.$es.html(es.forDisplay());
    
    
  },
};