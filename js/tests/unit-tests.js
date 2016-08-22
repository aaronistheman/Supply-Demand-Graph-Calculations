"use strict";

var currentTestedFile = undefined;

currentTestedFile = "model/economy-model.js";
QUnit.module(currentTestedFile +
 ", EconomyModel.prototype.calculateEquilibriumPoint()");

  // In this test, the intersection point is (by intention)
  // a given point
  QUnit.test("correct point found", function(assert) {    
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    var eqPoint = data.calculateEquilibriumPoint();
    
    assert.deepEqual(eqPoint.q(), 90);
    assert.deepEqual(eqPoint.p(), 0.75);
  });

  // In this test, the intersection point isn't a given point
  QUnit.test("correct point found again!", function(assert) {  
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.70 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.75 ; 80 0.25 ; 110 0.20";
    var data = new EconomyModel(supplyPoints, demandPoints);
    var eqPoint = data.calculateEquilibriumPoint()
    
    assert.deepEqual(eqPoint.q(), 70);
    assert.deepEqual(eqPoint.p(), 0.50);
  });

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateHighestQuantity()");

  QUnit.test("returns last demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateHighestQuantity(), 103);
  });

  QUnit.test("returns last supply quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateHighestQuantity(), 103);
  });

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateLowestQuantity()");

  QUnit.test("returns first demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "45 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestQuantity(), 45);
  });

  QUnit.test("returns first supply quantity", function(assert) {
    var supplyPoints = "45 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestQuantity(), 45);
  });

/*
QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateLowestEffectivePrice()");

  QUnit.test("returns first supply price", function(assert) {
    var supplyPoints = "45 0.26 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.23";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestEffectivePrice(), 0.26);
  });

  QUnit.test("returns last demand price", function(assert) {
    var supplyPoints = "45 0.33 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.31";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    console.log(data.mLowestQuantity);
    console.log(data.mHighestQuantity);
    assert.deepEqual(data.calculateLowestEffectivePrice(), 0.33);
  });

  QUnit.test("returns first supply price #2", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "30 1.25 ; 90 0.75 ; 110 0.30 ; 120 0.15";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestEffectivePrice(), 0.25);
  });
*/

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.getConsumerSurplus()");

  QUnit.test("correct value", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      6.00); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    assert.deepEqual(data.getConsumerSurplus().get(),
      23.50); // hand-calculated
  });
  
  /*
  QUnit.test("correct value yet again!", function(assert) {
    var data = new EconomyModel(
      "30 0.60 ; 60 0.90 ; 90 1.20",
      "30 0.90 ; 60 0.60 ; 90 0.30");
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  */
  
  QUnit.test("correct value yet again!", function(assert) {
    var data = new EconomyModel(
      "30 0.30 ; 60 0.60 ; 90 0.90",
      "30 0.90 ; 60 0.60 ; 90 0.30");
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      4.50); // hand-calculated
  });

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.getProducerSurplus()");

  QUnit.test("correct value", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    assert.deepEqual(data.getProducerSurplus().get(),
      4.50); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    assert.deepEqual(data.getProducerSurplus().get(),
      16.00); // hand-calculated
  });

QUnit.module(currentTestedFile + ", EconomyModel.prototype.getState()");

  QUnit.test("correctly detected equilibrium", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
    
    // nothing special has happened, so should be equilibrium
    assert.deepEqual(data.getState(), States.Equilibrium);
  });

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateWorldQd()");

  QUnit.test("correct value is a given quantity", function(assert) {
    var data = new EconomyModel(
      "8 80; 10 100; 12 120; 13 130",
      "8 120; 10 100; 12 80; 13 70");
    
    data.wp = 80;
    var result = Quantity.get(data.calculateWorldQd());
    assert.deepEqual(result, 12); // correct value is from a point on the graph
  });

  QUnit.test("correct value isn't a given quantity", function(assert) {
    var data = new EconomyModel(
      "40 1; 60 1.50;",
      "40 1.50; 60 1.00; 100 0.50");
    
    data.wp = 0.75;
    var result = Quantity.get(data.calculateWorldQd());
    assert.deepEqual(result, 80); // correct value isn't from a point
  });

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateWorldQs()");

  QUnit.test("correct value is a given quantity", function(assert) {
    var data = new EconomyModel(
      "7 65; 8 80; 10 100; 12 120; 13 130",
      "8 120; 10 100; 12 80; 13 70");
    
    data.wp = 80;
    var result = Quantity.get(data.calculateWorldQs());
    assert.deepEqual(result, 8); // correct value is from a point on the graph
  });
  
  QUnit.test("correct value isn't a given quantity", function(assert) {
    var data = new EconomyModel(
      "40 0.50; 80 1.00; 100 1.50",
      "80 1.50; 100 1.00");
    
    data.wp = 0.75;
    var result = Quantity.get(data.calculateWorldQs());
    assert.deepEqual(result, 60); // correct value isn't a point
  });
  
QUnit.module(currentTestedFile + ", EconomyModel.prototype.setTax()");

  QUnit.test("correct equilibrium point", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.75);
  });
  
  /*
  QUnit.test("demand tax: correct consumer surplus adjustment",
    function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      400); // hand-calculated
  });
  
  QUnit.test("supply tax: correct consumer surplus adjustment",
    function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  
  QUnit.test("correct supply offset from tax", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(Price.get(data.getSupply().getP(45)), 0.75);
  });
  
  QUnit.test("correct supply offset from subsidy", function(assert) {
    
  });
  
  QUnit.test("correct demand offset from subsidy", function(assert) {
    
  });
  
  QUnit.test("correct demand offset from tax", function(assert) {
    
  });
  */


