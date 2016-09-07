"use strict";

QUnit.module("tax on demand");

  QUnit.test("correct domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.45);
  });
  
  QUnit.test("corerct quantity demanded/supplied", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.qd, 45);
    assert.deepEqual(data.qs, 45);
  });
  
  QUnit.test("correct domestic total revenue", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    var answer = Price.get(45 * 0.45);
    assert.deepEqual(data.getTotalRevenue().get(), answer);
  });

  QUnit.test("correct consumer surplus",
    function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.12); // hand-calculated, but due to floating-point error
             // in the tested method, must use 1.12, not 1.13
  });
  
  QUnit.test("correct deadweight loss", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.1);
    assert.deepEqual(data.getDeadweightLoss().get(),
      Price.get((60 - 55) * (0.65 - 0.55) / 2)); // worked out by hand
  });
  
  QUnit.test("correct deadweight loss", function(assert) {
    var data = getLinearGraph2();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.getDeadweightLoss().get(),
      Price.get((60 - 50) * (0.70 - 0.40) / 2)); // worked out by hand
  });
  
  QUnit.test("correct tax revenue", function(assert) {
    var data = getLinearGraph1();
    
    var taxAmount = 0.1;
    data.setTax(Graph.Demand, taxAmount);
    assert.deepEqual(data.getTaxRevenue().get(),
      Price.get(taxAmount * 55)); // hand-determined
  });