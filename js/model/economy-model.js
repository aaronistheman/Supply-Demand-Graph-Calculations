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
  
  // Price mechanism stuff
  this.whichPm = Mechanism.None; // which price mechanism
  this.pmAmount = 0; // price mechanism's amount
  
  // Tax/subsidy settings
  this.mDemandTax = 0;
  this.mDemandSubsidy = 0;
  this.mSupplyTax = 0;
  this.mSupplySubsidy = 0;
  // this.whatTaxed; // should have a Graph constant value
  // this.whatSubsidized; // should have a Graph constant value
  
  // Tariff stuff
  this.tariffAmount = 0;
  
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
   * A subsidy moves demand vertically up and thus makes a positive offset,
   * while a tax does the opposite.
   */
  getDemandVerticalOffset : function() {
    return this.mDemandSubsidy - this.mDemandTax;
  },
  
  /**
   * A subsidy moves supply vertically down and thus makes a negative offset,
   * while a tax does the opposite.
   */
  getSupplyVerticalOffset : function() {
    return this.mSupplyTax - this.mSupplySubsidy;
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
      if (this.wp)
        this.cancelTariff();
      this.wp = undefined;
      this.qd = this.qs = this.eq;
    }
  }, // setWp()
  
  mIsValidTariff : function(amount) {
    if (amount != 0 && !this.wp) {
      alert("User Error: Can't set tariff unless is world price");
      return false;
    }
    else if (amount < 0) {
      alert("User Error: Tariff can't be negative");
      return false;
    }
    else if (amount >= this.ep) {
      alert("User Error: Tariff must be less than domestic price");
      return false;
    }
    else if (amount != 0 && amount <= this.wp) {
      alert("User Error: Tariff must be greater than world price");
      return false;
    }
    else
      return true;
  }, // mIsValidTariff()
  
  cancelTariff : function() {
    this.setTariffAmount(0);
  },
  
  setTariffAmount : function(amount) {
    if (!this.mIsValidTariff(amount))
      return;
    
    this.tariffAmount = amount;
    
    this.mUpdateEquilibriumPoint();
    if (amount == 0) { // if ending tariff
      this.qd = Quantity.get(this.calculateWorldQd());
      this.qs = Quantity.get(this.calculateWorldQs());
    }
    else { // if creating/changing tariff
      this.qd = Quantity.get(this.calculateTariffQd());
      this.qs = Quantity.get(this.calculateTariffQs());
    }
  }, // setTariffAmount()
  
  /**
   * @return a Price object
   */
  getTariffRevenue : function() {
    if (!this.tariffAmount) // if no tariff, is no tariff revenue
      return new Price(0);
    else
      return new Price(this.getNumberImports() * (this.tariffAmount - this.wp));
  },
  
  mIsValidPriceMechanismAmount : function(whichPriceMechanism, amount) {
    if (amount <= 0) {
      alert("User Error: Price mechanism amount must be positive number");
      return false;
    }
    else if (whichPriceMechanism == Mechanism.Ceiling) {
      if (amount >= this.ep) {
        alert("User Error: Price ceiling must be below equilibrium price");
        return false;
      }
      else
        return true;
    }
    else if (whichPriceMechanism == Mechanism.Floor) {
      if (amount <= this.ep) {
        alert("User Error: Price floor must be above equilibrium price");
        return false;
      }
      else
        return true;
    }
    else
      alertAndThrowException("Invalid whichPriceMechanism value");
  }, // mIsValidPriceMechanismAmount()
  
  /**
   * Lumps together the operations associated with setting a new
   * price mechanism.
   * @param whichPriceMechanism should be a Graph constant
   * @param amount
   */
  setPriceMechanismAmount : function(whichPriceMechanism, amount) {
    if (this.wp)
      alertAndThrowException("Can't set price mechanism if open economy");
    
    // if not valid input
    if(!this.mIsValidPriceMechanismAmount(whichPriceMechanism, amount))
      return;
    
    this.whichPm = whichPriceMechanism;
    this.pmAmount = amount;
    
    this.mUpdateEquilibriumPoint();
    if (this.whichPm == Mechanism.Ceiling) {
      this.qs = Quantity.get(this.calculatePriceCeilingQs());
      this.qd = Quantity.get(this.calculatePriceCeilingQd());
    }
    else { // price floor
      this.qs = Quantity.get(this.calculatePriceFloorQs());
      this.qd = Quantity.get(this.calculatePriceFloorQd());
    }
  }, // setPriceMechanismAmount()
  
  /**
   * Switches the type of the price mechanism, while taking some
   * measures to avoid leaving the user with an invalid price mechanism.
   *
   * @param newMechanism the price mechanism to switch to;
   * should be a constant of the Mechanism object
   */
  switchPriceMechanism : function(newMechanism) {
    // If the mechanism didn't really change, then this method shouldn't
    // have been called
    if (this.whichPm != Mechanism.None && this.whichPm == newMechanism)
      alertAndThrowException("switchPriceMechanism() called when "
        + "no switch occurred");
      
    switch (newMechanism) {
    case Mechanism.Ceiling:
    case Mechanism.Floor:
    case Mechanism.None:
      this.whichPm = newMechanism;
      this.pmAmount = 0; // otherwise, the user could end up with an invalid
                         // new price mechanism
      this.qs = this.qd = this.eq; // since price mechanism is disabled
                                   // (although the type is switched)
      break;
    default:
      alertAndThrowException("Invalid newMechanism in switchPriceMechanism()");
    }
  }, // switchPriceMechanism()
  
  /**
   * @pre economy is closed
   * @param whichGraph should be a Graph constant
   * @param amount
   */
  setTax : function(whichGraph, amount) {
    if (this.wp)
      alertAndThrowException("Can't call setTax() if open economy");
    
    if (amount < 0) {
      alert("User error: can't have negative tax");
      return;
    }
    
    // clear both tax amounts
    this.mDemandTax = this.mSupplyTax = 0;
  
    // apply new tax amount to right graph
    if (whichGraph == Graph.Supply)
      this.mSupplyTax = amount;
    else if (whichGraph == Graph.Demand)
      this.mDemandTax = amount;
    else
      alertAndThrowException("Invalid whichGraph given to setTax()");
    
    this.mUpdateEquilibriumPoint();
    this.qs = this.qd = this.eq;
  }, // setTax()
  
  /**
   * @pre economy is closed
   * @param whichGraph should be a Graph constant
   * @param amount
   */
  setSubsidy : function(whichGraph, amount) {
    if (this.wp)
      alertAndThrowException("Can't call setSubsidy() if open economy");
    
    if (amount < 0) {
      alert("User error: can't have negative subsidy");
      return;
    }
    
    // clear both subsidy amounts
    this.mDemandSubsidy = this.mSupplySubsidy = 0;
    
    // apply new subsidy amount to right graph
    if (whichGraph == Graph.Supply)
      this.mSupplySubsidy = amount;
    else if (whichGraph == Graph.Demand)
      this.mDemandSubsidy = amount;
    else
      alertAndThrowException("Invalid whichGraph given to setSubsidy()");
    
    this.mUpdateEquilibriumPoint();
    this.qs = this.qd = this.eq;
  }, // setSubsidy()
  
  /**
   * Swaps tax on demand with tax on supply.
   */
  switchTaxedGraph : function() {
    var temp = this.mDemandTax;
    this.mDemandTax = this.mSupplyTax;
    this.mSupplyTax = temp;
    
    this.mUpdateEquilibriumPoint();
    this.qs = this.qd = this.eq;
  },
  
  /**
   * Swaps subsidy on demand with subsidy on supply.
   */
  switchSubsidizedGraph : function() {
    var temp = this.mDemandSubsidy;
    this.mDemandSubsidy = this.mSupplySubsidy;
    this.mSupplySubsidy = temp;
    
    this.mUpdateEquilibriumPoint();
    this.qs = this.qd = this.eq;
  },
  
  /**
   * Gets total DOMESTIC producers' revenue.
   * @return instance of Price
   */
  getTotalRevenue : function() {
    var priceToUse;
    if (this.pmAmount)
      priceToUse = this.pmAmount;
    else if (this.tariffAmount)
      priceToUse = this.tariffAmount;
    else if (this.wp)
      priceToUse = this.wp;
    else
      priceToUse = this.ep;
    
    return new Price(Math.min(this.qs, this.qd) * priceToUse);
  },
  
  /**
   * Consumer surplus is the integral from lowest quantity
   * to the quantity demanded
   * of the difference between demand and the effective price.
   * (Note that this method can't be perfect, due to possible
   * floating-point error.)
   *
   * @return a Price object, since consumer surplus is in dollars
   */
  getConsumerSurplus : function() {
    var range = Math.min(this.qd, this.qs) - this.mLowestQuantity;
    var step = range / this.mNumRectangles;
    var answer = 0;
    var effectivePrice = this.mGetEffectiveWelfarePrice();
    
    // Execute the Riemann summation
    for (var q = this.mLowestQuantity + step, i = 0;
      i < this.mNumRectangles; q += step, ++i)
    {
      answer += (this.mDemand.getP(q, this.getDemandVerticalOffset())
        - effectivePrice) * step;
    }
    
    return (new Price(answer));
  },
  
  /**
   * Producer surplus is the integral from lowest quantity
   * to the quantity supplied of the difference between
   * the effective price and supply.
   * (Note that this method can't be perfect, due to possible
   * floating-point error.)
   *
   * @return a Price object, since producer surplus is in dollars
   */
  getProducerSurplus : function() {
    var range = Math.min(this.qd, this.qs) - this.mLowestQuantity;
    var step = range / this.mNumRectangles;
    var answer = 0;
    var effectivePrice = this.mGetEffectiveWelfarePrice();
    
    // Execute the Riemann summation
    for (var q = this.mLowestQuantity + step, i = 0;
      i < this.mNumRectangles; q += step, ++i)
    {
      answer += (effectivePrice - this.mSupply.getP(q,
        this.getSupplyVerticalOffset())) * step;
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

  /**
   * NOTE: This method is not used in the application itself,
   * because I (Aaron) did not have the Economics background
   * needed to analyze complex cases of deadweight loss.
   * (e.g. How is deadweight loss calculated if there is a tax,
   * a price mechanism, and a tariff/quota?)
   *
   * @return a Price object
   */
  getDeadweightLoss : function() {
    if (this.mDemandTax > 0 || this.mSupplyTax > 0) { // if there is a tax
      /**
       * In this case, deadweight loss is the integral from
       * the current equilibrium quantity to the formerly current
       * equilibrium quantity of the difference between.
       */
      
      // Set up Riemann sum
      var formerEqQ = this.calculateEquilibriumPoint(true).q();
      var range = formerEqQ - this.eq;
      var step = range / this.mNumRectangles;
      var answer = 0;
      
      // Execute "right Riemann sum"
      for (var q = this.eq + step, i = 0;
        i < this.mNumRectangles; q += step, ++i)
      {
        answer += step
          * (this.mDemand.getP(q, 0) - this.mSupply.getP(q, 0));
      }
      
      return (new Price(answer));
    } // if there is a tax
    else {
      // Be default, there is no deadweight loss
      return new Price(0);
    }
  }, // getDeadweightLoss()
  
  /**
   * @return a Price object
   */
  getTaxRevenue : function() {
    // Minimum of the two domestic quantities is
    // taken because I'm (boldly) assuming (for this simplified model)
    // that this minimum is how much is produced (even though this
    // may contradict the definition of quantity "supplied").
    // Max of the two taxes is taken because at least one of
    // them must be zero, so this obtains the tax magnitude.
    return new Price(Math.min(this.qd, this.qs)
      * Math.max(this.mSupplyTax, this.mDemandTax));
  }, // getTaxRevenue()
  
  /**
   * @param ignoreOffset set to true to ignore any offset to supply
   * and/or demand
   * @return a new Point instance representing where the supply and
   * demand graphs (first) intersect
   */
  calculateEquilibriumPoint : function(ignoreOffset=false) {
    if (ignoreOffset) {
      var demandOffset = 0, supplyOffset = 0;
    }
    else {
      var demandOffset = this.getDemandVerticalOffset();
      var supplyOffset = this.getSupplyVerticalOffset();
    }
    
    // Calculate step magnitude
    var range = this.mHighestQuantity - this.mLowestQuantity;
    var step = range / this.mNumRectangles;
    
    // Determine starting points
    var qVal = this.mLowestQuantity;
    var dVal = this.mDemand.getP(qVal, demandOffset);
    var sVal = this.mSupply.getP(qVal, supplyOffset);
    
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
      dVal = this.mDemand.getP(qVal, demandOffset);
      sVal = this.mSupply.getP(qVal, supplyOffset);
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
  
  calculateTariffQd : function() {
    return this.mDemand.getQ(this.tariffAmount, this.eq,
      this.mDPoints[this.mDPoints.length - 1].q(), this.mNumRectangles,
      function(currentPrice, goalPrice) { return currentPrice > goalPrice; });
  }, // calculateTariffQd()
  
  calculateTariffQs : function() {
    return this.mSupply.getQ(this.tariffAmount, this.eq,
      this.mSPoints[0].q(), this.mNumRectangles,
      function(currentPrice, goalPrice) { return currentPrice > goalPrice; });
  }, // calculateTariffQs()
  
  calculatePriceCeilingQs : function() {
    if (!this.pmAmount)
      alertAndThrowException("Must be a price mechanism");
    
    // if price ceiling is so low that extrapolation on the user's
    // given supply graph data would occur
    if (this.pmAmount < this.mSPoints[0].p())
      return undefined;
    
    return this.mSupply.getQ(this.pmAmount, this.eq,
      this.mSPoints[0].q(), this.mNumRectangles,
      function(currentPrice, goalPrice) { return currentPrice > goalPrice; });
  }, // calculatePriceCeilingQs
  
  calculatePriceCeilingQd : function() {
    if (!this.pmAmount)
      alertAndThrowException("Must be a price mechanism");
    
    // if price ceiling is so low that extrapolation on the user's
    // given demand graph data would occur
    if (this.pmAmount < this.mDPoints[this.mDPoints.length - 1].p())
      return undefined;
    
    return this.mDemand.getQ(this.pmAmount, this.eq,
      this.mDPoints[this.mDPoints.length - 1].q(), this.mNumRectangles,
      function(currentPrice, goalPrice) { return currentPrice > goalPrice; });
  }, // calculatePriceCeilingQd()
  
  calculatePriceFloorQs : function() {
    if (!this.pmAmount)
      alertAndThrowException("Must be a price mechanism");
    
    // if price floor is so high that extrapolation on the user's
    // given supply graph data would occur
    if (this.pmAmount > this.mSPoints[this.mSPoints.length - 1].p())
      return undefined;
    
    return this.mSupply.getQ(this.pmAmount, this.eq,
      this.mSPoints[this.mSPoints.length - 1].q(), this.mNumRectangles,
      function(currentPrice, goalPrice) { return currentPrice < goalPrice; });
      
  }, // calculatePriceFloorQs()
  
  calculatePriceFloorQd : function() {
    if (!this.pmAmount)
      alertAndThrowException("Must be a price mechanism");
    
    // if price floor is so high that extrapolation on the user's
    // given demand graph data would occur
    if (this.pmAmount > this.mDPoints[0].p())
      return undefined;
    
    return this.mDemand.getQ(this.pmAmount, this.eq,
      this.mDPoints[0].q(), this.mNumRectangles,
      function(currentPrice, goalPrice) { return currentPrice < goalPrice; });
  }, // calculatePriceFloorQd()
  
  /**
   * @return the quantity demanded at the current world price
   */
  calculateWorldQd : function() {
    // if world price would cause extrapolation beyond user's
    // given demand graph data
    if (this.wp < this.mDPoints[this.mDPoints.length - 1].p()) {
      throw "fail";
    }

    // Set up a traversal from the equilibrium quantity to last
    // demand quantity
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
    // if world price would cause extrapolation beyond user's
    // given supply graph data
    if (this.wp < this.mSPoints[0].p()) {
      throw "fail";
    }

    // Set up a traversal from first supply quantity to equilibrium quantity
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
   * @return the price value that should be used for welfare
   * measurements
   */
  mGetEffectiveWelfarePrice : function() {
    /**
     * Notes regarding the order of the below cases:
     * 1) There can't be both world price and price mechanism simultaneously,
     * so I can handle the two cases separately.
     * 2) A tariff takes precedence over the world price, because
     * that's how a tariff works for the country imposing it.
     */
    if (this.tariffAmount)
      return this.tariffAmount;
    else if (this.wp)
      return this.wp
    else if (this.pmAmount)
      return this.pmAmount;
    else
      return this.ep
  }, // mGetEffectiveWelfarePrice()
  
  /**
   * Convenient method for having this model recalculate the values
   * of its members that are not recalculated by default. (For
   * example, consumer surplus is always recalculated (when the
   * view objects look for it), but quantity supplied isn't.)
   */
  // mRecalculateDomesticHardcodedValues : function() {
    
  // },
};