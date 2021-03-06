"use strict";

QUnit.module("tax and subsidy both on demand");

  QUnit.test("correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net demand movement up 0.30
    data.setTax(Graph.Demand, 0.15);
    data.setSubsidy(Graph.Demand, 0.45);
    
    assert.deepEqual(data.eq, 75);
    assert.deepEqual(data.ep, 0.75);
  });

  QUnit.test("correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net demand movement: down 0.10
    data.setTax(Graph.Demand, 0.20);
    data.setSubsidy(Graph.Demand, 0.10);
    
    assert.deepEqual(data.eq, 55);
    assert.deepEqual(data.ep, 0.55);
  });

  QUnit.test("correct domestic total revenue", function(assert) {
    var data = getLinearGraph1();
    
    // net demand movement up 0.18
    data.setTax(Graph.Demand, 0.23);
    data.setSubsidy(Graph.Demand, 0.41);
    
    assert.deepEqual(data.getTotalRevenue().get(),
      47.61); // hand-calculated
  });
  
  QUnit.test("correct tax revenue", function(assert) {
    var data = getLinearGraph1();
    
    // net demand movement: down 0.10
    var taxAmount = 0.2;
    data.setTax(Graph.Demand, taxAmount);
    data.setSubsidy(Graph.Demand, 0.10);
    
    assert.deepEqual(data.getTaxRevenue().get(),
      Price.get(taxAmount * 55)); // hand-determined
  });