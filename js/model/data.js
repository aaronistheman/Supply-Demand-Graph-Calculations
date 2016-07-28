"use strict";

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
  this.wp; // world price
  this.taxAmount;
  this.whatTaxed; // should have a Graph constant value
  this.subsidyAmount;
  this.whatSubsidized; // should have a Graph constant value
  this.priceMechanism;
  this.pmAmount; // price mechanism's amount
  
  this.mNumRectangles = 100000; // usually for Riemann sums
  
  this.mSupply = new PiecewiseFunction();
  this.mReadFunctionData(this.mSupply, supplyDataString);
  
  this.mDemand = new PiecewiseFunction();
  this.mReadFunctionData(this.mDemand, demandDataString);
  
  // Store references to the Point arrays
  this.mSPoints = this.mSupply.getPoints();
  this.mDPoints = this.mDemand.getPoints();
  
  // Must happen after reading function data
  this.mLowestQuantity = this.calculateLowestQuantity();
  this.mHighestQuantity = this.calculateHighestQuantity();
} // custom type Data

Data.prototype = {
  constructor : Data,
  
  /**
   * Accessors
   */
  
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
   * Non-accessor, non-mutator, public methods
   */
  
  /**
   * @param changedSettings object that maps each changed setting
   * (e.g. world price) to its new value
   */
  update : function(changedSettings) {
    
  },
  
  /**
   * @return a new Point instance representing where the supply and
   * demand graphs (first) intersect
   */
  calculateEquilibriumPoint : function() {
    return new Point(-1, -2.00);
  }, // calculateEquilibriumPoint()
  
  /**
   * @returns the lowest quantity (value) that can be used for calculations
   * (i.e. the maximum of the two quantities of the lowest
   * demand and supply points)
   */
  calculateLowestQuantity : function() {
    // Get first supply point quantity
    var sLow = this.mSPoints[0].q();
    
    // Get first demand point quantity
    var dLow = this.mDPoints[0].q();
    
    if (sLow > dLow)
      return sLow;
    else
      return dLow;
  }, // calculateLowestQuantity()
  
  /**
   * @returns the highest quantity (value) that can be used for
   * calculations (i.e. the minimum of the two quantities of the
   * highest demand and supply points)
   */
  calculateHighestQuantity : function() {
    // Get last supply point quantity
    var sHigh = this.mSPoints[this.mSPoints.length - 1].q();
    
    // Get last demand point quantity
    var dHigh = this.mDPoints[this.mDPoints.length - 1].q();
    
    if (sHigh > dHigh)
      return dHigh;
    else
      return sHigh;
  }, // calculateHighestQuantity()
  
  /**
   * "Private" methods
   */
  
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

      func.insert(new Point(q, p));
    }
  }, // mReadFunctionData()
  
  /**
   * Recalculates the equilibrium quantity and equilibrium price
   * and stores them.
   */
  mUpdateEquilibriumPoint : function() {
    
  }, // mUpdateEquilibriumPoint()
};