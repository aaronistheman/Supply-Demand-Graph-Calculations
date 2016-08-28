"use strict";

QUnit.module("tax on supply");

  QUnit.test("correct domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.75);
  });
  
  // QUnit.test("correct domestic equilibrium", function(assert) {
    // var data = 
  // });
  
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
  
  /* Has rounding issue:
  QUnit.test("correct consumer surplus", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.1);
    assert.deepEqual(data.getConsumerSurplus().get(),
      Price.get((0.9 - 0.65) * (55 - 30) / 2)); // worked out by hand
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  
  QUnit.test("correct producer surplus", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.1);
    assert.deepEqual(data.getProducerSurplus().get(),
      Price.get((0.65 - 0.4) * (55 - 30) / 2)); // worked out by hand
  });
  */
  
  