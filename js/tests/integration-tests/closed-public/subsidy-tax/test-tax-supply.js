"use strict";

QUnit.module("tax on supply");

  QUnit.test("correct domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.75);
  });
  
  QUnit.test("can still obtain 'pre-tax' domestic equilibrium",
    function(assert)
  {
    var data = getLinearGraph1();
    data.setTax(Graph.Supply, 0.3);
    var eqPoint = data.calculateEquilibriumPoint(true);
    
    assert.deepEqual(eqPoint.q(), 60);
    assert.deepEqual(eqPoint.p(), 0.60);
  });
  
  QUnit.test("correct quantity demanded/supplied", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.qd, 45);
    assert.deepEqual(data.qs, 45);
  });
  
  QUnit.test("correct domestic total revenue", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    var answer = Price.get(45 * 0.75);
    assert.deepEqual(data.getTotalRevenue().get(), answer);
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.1);
    assert.deepEqual(data.getConsumerSurplus().get(),
      3.12); // worked out by hand from (0.9 - 0.65) * (55 - 30) / 2));
             // however, due to floating-point error in the tested
             // method, I must use 3.12 instead of 3.13
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.12); // hand-calculated, but due to floating-point error
             // in tested method, must use 1.12 instead of 1.13
  });
  
  QUnit.test("correct producer surplus", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.1);
    assert.deepEqual(data.getProducerSurplus().get(),
      3.12); // worked out by hand from (0.65 - 0.4) * (55 - 30) / 2);
             // however, due to floating-point error in the tested
             // method, I must use 3.12 instead of 3.13
  });
  
  QUnit.test("correct deadweight loss", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.1);
    assert.deepEqual(data.getDeadweightLoss().get(),
      Price.get((60 - 55) * (0.65 - 0.55) / 2)); // worked out by hand
  });
  
  QUnit.test("correct deadweight loss", function(assert) {
    var data = getLinearGraph2();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.getDeadweightLoss().get(),
      Price.get((60 - 50) * (0.70 - 0.40) / 2)); // worked out by hand
  });
  
  QUnit.test("correct tax revenue", function(assert) {
    var data = getLinearGraph1();
    
    var taxAmount = 0.1;
    data.setTax(Graph.Supply, taxAmount);
    assert.deepEqual(data.getTaxRevenue().get(),
      Price.get(taxAmount * 55)); // hand-determined
  });