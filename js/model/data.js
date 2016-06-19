"use strict";

var States = {
  Equilibrium : "Equilibrium",
  Shortage : "Shortage",
  Surplus : "Surplus",
};

var Graph = {
  Demand : "Demand",
  Supply : "Supply",
  None : "None",
};

/**
 * Custom type that stores the data of the supply and demand graphs
 * and the settings given by the user.
 *
 * Private members have an 'm' prefix (e.g. mDoSomethingPrivate())
 */
function Data(supplyDataPoints, demandDataPoints) {
  this.eq; // equilibrium quantity
  this.ep; // equilibrium price
  this.qd; // quantity demanded
  this.qs; // quantity supplied
  this.wp;
  this.taxAmount;
  this.whatTaxed;
  this.subsidyAmount;
  this.whatSubsidized;
  this.priceMechanism;
  this.pmAmount;
  
} // custom type Data

Data.prototype = {
  constructor : Data,
  
  getState : function() {
    if (this.qd.get() === this.qs.get())
      return States.Equilibrium;
    else if (this.qd.get() < this.qs.get())
      return States.Surplus;
    else // qd > qs
      return States.Shortage;
  },
  
  getTotalRevenue : function() {
    
  },
  
  /**
   * @return a Price object, since consumer surplus is in dollars
   */
  getConsumerSurplus : function() {
    
  },
  
  /**
   * @return a Price object, since producer surplus is in dollars
   */
  getProducerSurplus : function() {
    
  },
  
  /**
   * @param cs consumer surplus; specify to avoid recalculation
   * @param ps producer surplus; specify to avoid recalculation
   * @return a Price object
   */
  getTotalSurplus : function(cs, ps) {
    if (arguments.length == 2)
      return new Price(cs + ps);
    else {
      ; // calculate total surplus
    }
  },
  
  /**
   * @return a Quantity object
   */
  getNumberImports : function() {
    
  },
  
  getDeadweightLoss : function() {
    // decide what type of object is returned
  },
  
  getTaxRevenue : function() {
    
  },
  
  /**
   * @param changedSettings object that maps each changed setting
   * (e.g. world price) to its new value
   */
  update : function(changedSettings) {
    
  },
  
  
};