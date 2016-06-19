"use strict";

/**
 * Constants
 */

var States = {
  Equilibrium : "Equilibrium",
  Shortage : "Shortage",
  Surplus : "Surplus",
};

var Graph = {
  Supply : "Supply",
  Demand : "Demand",
  None : "None",
};

var Mechanism = {
  Floor : "Floor",
  Ceiling : "Ceiling",
  None : "None",
};

/**
 * Custom type that stores the data of the supply and demand graphs
 * and the settings given by the user.
 *
 * Private members have an 'm' prefix (e.g. mDoSomethingPrivate())
 */
function Data(supplyDataString, demandDataString) {
  if (!(this instanceof Data))
    alertAndThrowException("Forgot 'new' before Data constructor");
  
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
  
  this.mNumRectangles = 100000; // usually for Riemann sums
  
  this.mSPoints = [];
  this.mSupply = new PiecewiseFunction();
  this.mReadFunctionData(this.mSupply, supplyDataString);
  
  this.mDPoints = [];
  this.mDemand = new PiecewiseFunction();
  this.mReadFunctionData(this.mDemand, demandDataString);
  
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
  
  /**
   * @param func instance of PiecewiseFunction
   * @param dataString properly formatted string (e.g. "40 0.25; 50 0.30")
   * of ordered pairs (intended for (quantity, price) pairs)
   */
  mReadFunctionData : function(func, dataString) {
    var q = -1;
    var p = -1;
    var qString = "";
    var pString = "";
    var qArray = [];
    var pArray = [];
    var sin = new StringInput(dataString);

    while (!sin.isAtEnd()) {
      // get q
      sin.ignore(' ');
      qString = sin.getCharsUntil(' ');
      q = parseFloat(qString);

      // get p
      sin.ignore(' ');
      pString = sin.getCharsUntil(' ');
      p = parseFloat(pString);

      // ignore until semi-colon (or reach end)
      sin.ignore(' ');
      sin.ignore(';');

      func.insert(new Point(Quantity(q), Price(p)));
    }
  }, // mReadFunctionData()
};