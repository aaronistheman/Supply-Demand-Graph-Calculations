"use strict";

/**
 * Custom type that stores the data of the supply and demand graphs
 * and the settings given by the user.
 *
 * Private members have an 'm' prefix (e.g. mDoSomethingPrivate())
 *
 * Regarding the methods that use Riemann sums: the number of rectangles
 * and the use of rounding, in my opinion, make which Riemann sum
 * (e.g. right, left, midpoint) I use unimportant.
 *
 * @param supplyDataString should have following format:
 * "quantity price ; quantity price ; quantity price", with
 * increasing quantities; (see unit tests for examples)
 * @param demandDataString see immediately above
 */
function EconomyModel(supplyDataString, demandDataString) {
  if (!(this instanceof EconomyModel))
    alertAndThrowException("Forgot 'new' before EconomyModel constructor");
  
  this.eq; // domestic equilibrium quantity value
  this.ep; // domestic equilibrium price value
  this.qd; // quantity demanded (by domestic demanders) value
  this.qs; // quantity supplied (by domestic suppliers) value
  this.wp; // world price
  this.taxAmount;
  this.whatTaxed; // should have a Graph constant value
  this.subsidyAmount;
  this.whatSubsidized; // should have a Graph constant value
  this.priceMechanism;
  this.pmAmount; // price mechanism's amount
  
  // Tax/subsidy settings
  this.mDemandTax = 0;
  this.mDemandSubsidy = 0;
  this.mSupplyTax = 0;
  this.mSupplySubsidy = 0;
  
  this.mNumRectangles = 100000; // usually for Riemann sums
  
  this.mSupply = new PiecewiseFunction();
  this.mReadFunctionData(this.mSupply, supplyDataString);
  
  this.mDemand = new PiecewiseFunction();
  this.mReadFunctionData(this.mDemand, demandDataString);
  
  // Store references to the Point arrays
  this.mSPoints = this.mSupply.getPoints();
  this.mDPoints = this.mDemand.getPoints();
  
  // Here, by "lowest" and "highest", I mean the lowest and highest
  // quantities/price that can be used without causing extrapolation
  // (i.e. the lowest and highest quantities/price that BOTH supply
  // and demand have in common)
  this.mLowestQuantity = this.calculateLowestQuantity();
  this.mHighestQuantity = this.calculateHighestQuantity();
  // this.mLowestPrice = this.calculateLowestEffectivePrice();
  
  this.mUpdateEquilibriumPoint();
  
  // By default, economy is in equilibrium
  this.qd = this.qs = this.eq;
} // custom type EconomyModel

EconomyModel.prototype = {
  constructor : EconomyModel,
  
  getState : function() {
    if (this.qd === this.qs)
      return States.Equilibrium;
    else if (this.qd < this.qs)
      return States.Surplus;
    else // qd > qs
      return States.Shortage;
  },
  
  getDemand : function() {
    return this.mDemand;
  },
  
  getSupply : function() {
    return this.mSupply;
  },
  
  /**
   * I decided that a positive offset indicates a subsidy.
   */
  getDemandOffset : function() {
    return this.mDemandSubsidy - this.mDemandTax;
  },
  
  /**
   * I decided that a positive offset indicates a subsidy.
   */
  getSupplyOffset : function() {
    return this.mSupplySubsidy - this.mSupplyTax;
  },
  
  getTaxAmount : function() {
    // Since only one of demand and supply can be taxed (in this program):
    return Math.max(this.mDemandTax, this.mSupplyTax);
  },
  
  getSubsidyAmount : function() {
    // Since only one of demand and supply can be subsidized
    // (in this program):
    return Math.max(this.mDemandSubsidy, this.mSupplySubsidy);
  },
  
  getLowestEffectiveQuantity : function() {
    return this.mLowestQuantity;
  },
  
  /*
  getLowestEffectivePrice : function() {
    return this.mLowestPrice;
  },
  */
  
  /**
   * Although this mutator isn't needed (this.wp is "public"),
   * it conveniently lumps together the operations associated
   * with changing the world price.
   *
   * @param newWp (not necessarily rounded) price value;
   * newWp < this.ep; use undefined (or some false value) to eliminate
   * world price
   * @throws exception (that should be caught) if user gave
   * world price that causes extrapolation
   */
  setWp : function(newWp) {
    if (newWp) { // if user set new world price
      // In case need to reverse changes
      var oldWp = this.wp;
      var oldQd = this.qd;
      var oldQs = this.qs;
    
      var newWpRounded = Price.get(newWp);
      
      // error-checking
      if (newWpRounded >= this.ep)
        alertAndThrowException(
          "setWp was given world price higher than equilibrium price");
    
      this.wp = newWpRounded;

      try {
        this.qd = Quantity.get(this.calculateWorldQd());
      }
      catch(err) {
        // undo changes
        this.wp = oldWp;

        throw "demand extrapolation";
      }
      try {
        this.qs = Quantity.get(this.calculateWorldQs());
      }
      catch(err) {
        // undo changes
        this.wp = oldWp;
        this.qd = oldQd;

        throw "supply extrapolation";
      }
    }
    else { // if user eliminated world price
      this.wp = undefined;
      this.qd = this.qs = this.eq;
    }
  }, // setWp()
  
  /**
   * @param whichGraph should be a Graph constant
   * @param amount
   */
  setTax : function(whichGraph, amount) {
    // clear both tax amounts
    this.mDemandTax = this.mSupplyTax = 0;
  
    // apply new tax amount to right graph
    if (whichGraph == Graph.Supply)
      this.mSupplyTax = amount;
    else if (whichGraph == Graph.Demand)
      this.mDemandTax = amount;
    else
      alertAndThrowException("Invalid whichGraph given to setTax()");
  }, // setTax()
  
  /**
   * @param whichGraph should be a Graph constant
   * @param amount
   */
  setSubsidy : function(whichGraph, amount) {
    // clear both subsidy amounts
    this.mDemandSubsidy = this.mSupplySubsidy = 0;
    
    // apply new subsidy amount to right graph
    if (whichGraph == Graph.Supply)
      this.mSupplySubsidy = amount;
    else if (whichGraph == Graph.Demand)
      this.mDemandSubsidy = amount;
    else
      alertAndThrowException("Invalid whichGraph given to setSubsidy()");
  }, // setSubsidy()
  
  /**
   * @return instance of Price
   */
  getTotalRevenue : function() {
    // I know this isn't right and will eventually
    // fix it; TR = price x min(qd, qs) (what's "price"?)
    return new Price(Math.min(this.qs, this.qd) * this.ep);
  },
  
  /**
   * Consumer surplus is the integral from lowest quantity
   * to the quantity demanded
   * of the difference between demand and the effective price.
   *
   * @return a Price object, since consumer surplus is in dollars
   */
  getConsumerSurplus : function() {
    var range = this.qd - this.mLowestQuantity;
    var step = range / this.mNumRectangles;
    var answer = 0;
    var effectivePrice = this.mGetEffectiveWelfareQuantity();
    
    // Execute the Riemann summation
    for (var q = this.mLowestQuantity + step, i = 0;
      i < this.mNumRectangles; q += step, ++i)
    {
      answer += (this.mDemand.getP(q) - effectivePrice) * step;
    }
    
    return (new Price(answer));
  },
  
  /**
   * Producer surplus is the integral from lowest quantity
   * to the quantity supplied of the difference between
   * the effective price and supply.
   *
   * @return a Price object, since producer surplus is in dollars
   */
  getProducerSurplus : function() {
    var range = this.qs - this.mLowestQuantity;
    var step = range / this.mNumRectangles;
    var answer = 0;
    var effectivePrice = this.mGetEffectiveWelfareQuantity();
    
    // Execute the Riemann summation
    for (var q = this.mLowestQuantity + step, i = 0;
      i < this.mNumRectangles; q += step, ++i)
    {
      answer += (effectivePrice - this.mSupply.getP(q)) * step;
    }
    
    return (new Price(answer));
  },
  
  /**
   * Specify both parameters to avoid recalculation.
   * @param cs consumer surplus; Price object
   * @param ps producer surplus; Price object
   * @return a Price object
   */
  getEconomicSurplus : function(cs, ps) {
    if (arguments.length == 2)
      return new Price(cs.getUnrounded() + ps.getUnrounded());
    else {
      ; // calculate total surplus
      
      alertAndThrowException("getEconomicSurplus() not fully implemented");
    }
  },
  
  /**
   * @return a quantity value
   */
  getNumberImports : function() {
    if (this.qd > this.qs) // if importing makes sense
      return this.qd - this.qs;
    else // if are exports (or no trade)
      return 0;
  },
  
  getDeadweightLoss : function() {
    // decide what type of object is returned
  },
  
  getTaxRevenue : function() {
    
  },
  
  /**
   * @return a new Point instance representing where the supply and
   * demand graphs (first) intersect
   */
  calculateEquilibriumPoint : function() {
    // Calculate step magnitude
    var range = this.mHighestQuantity - this.mLowestQuantity;
    var step = range / this.mNumRectangles;
    
    // Determine starting points
    var qVal = this.mLowestQuantity;
    var dVal = this.mDemand.getP(qVal);
    var sVal = this.mSupply.getP(qVal);
    
    var oldD = dVal;
    // var oldS = sVal;
    
    /**
     * Find the intersection of the S and D graphs.
     * Imagine sliding a ruler vertically along the graphs,
     * stopping the moment that the demand point on the ruler
     * isn't greater than the supply point.
     */
    while (dVal > sVal && qVal <= this.mHighestQuantity) {
      oldD = dVal;
      // oldS = sVal;
      
      // Advance one step
      qVal += step;
      dVal = this.mDemand.getP(qVal);
      sVal = this.mSupply.getP(qVal);
    }
    
    if (qVal > this._highestQuantity)
      alertAndThrowException("Supply and demand don't intersect");
    
    // The equilibrium point should be right before D becomes below S
    // (rather than right after),
    // although this is highly unlikely to matter, due to the small
    // step value.
    return new Point(qVal, oldD);
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
   * This method is flawed in assuming that supply is always
   * increasing and demand is always decreasing.
   * @pre mLowestQuantity and mHighestQuantity have been set
   * @returns (rounded) the lowest price that both graphs have in common
   */
  /*
  calculateLowestEffectivePrice : function() {
    if (!this.mLowestQuantity || !this.mHighestQuantity)
      alertAndThrowException(
        "Precondition violated, calculateLowestEffectivePrice");
    
    return Price.get(Math.max(
      this.mSupply.getP(this.mLowestQuantity),
      this.mDemand.getP(this.mHighestQuantity)));
  },
  */
  
  /**
   * @return the quantity demanded at the current world price
   */
  calculateWorldQd : function() {
    if (this.wp < this.mDPoints[this.mDPoints.length - 1].p()) {
      throw "fail";
    }

    var range = this.mDPoints[this.mDPoints.length - 1].q() - this.eq;
    var step = range / this.mNumRectangles;
    var q = this.eq;
    var price = this.mDemand.getP(q);
    
    // Go forward from equilibrium point until price would become
    // lower than world price,
    // at which point the method would stop and return the current quantity
    while (price > this.wp) {
      // advance
      q += step;
      price = this.mDemand.getP(q);
    }
    
    return q;
  }, // calculateWorldQd()
  
  /**
   * @return the quantity supplied at the current world price
   */
  calculateWorldQs : function() {
    if (this.wp < this.mSPoints[0].p()) {
      throw "fail";
    }

    var range = this.eq - this.mSPoints[0].q();
    var step = range / this.mNumRectangles;
    var q = this.eq;
    var price = this.mSupply.getP(q);
    
    // Go backward from equilibrium point until price would become
    // lower than world price,
    // at which point the method would stop and return the current quantity
    while (price > this.wp) {
      // advance
      q -= step;
      price = this.mSupply.getP(q);
    }
    
    return q;
  }, // calculateWorldQs()
  
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
    var eqPoint = this.calculateEquilibriumPoint();
    this.eq = eqPoint.q();
    this.ep = eqPoint.p();
  }, // mUpdateEquilibriumPoint()
  
  /**
   * @return the quantity value that should be used for welfare
   * measurements
   */
  mGetEffectiveWelfareQuantity : function() {
    if (this.wp)
      return this.wp
    else
      return this.ep
  }, // mGetEffectiveWelfareQuantity()
};