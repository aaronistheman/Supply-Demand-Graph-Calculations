"use strict";

var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile + ", EconomyModel.prototype.setTax()");

  QUnit.test("correct equilibrium point", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.75);
  });
  
  /*
  QUnit.test("demand tax: correct consumer surplus adjustment",
    function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      400); // hand-calculated
  });
  
  QUnit.test("supply tax: correct consumer surplus adjustment",
    function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  
  QUnit.test("correct supply offset from tax", function(assert) {
    var data = getLinearGraph1();
    
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