"use strict";

QUnit.module("tax and subsidy both on supply");

  QUnit.test("correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net supply movement: down 0.30
    data.setTax(Graph.Supply, 0.15);
    data.setSubsidy(Graph.Supply, 0.45);
    
    assert.deepEqual(data.eq, 75);
    assert.deepEqual(data.ep, 0.45);
  });

  QUnit.test("correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net supply movement: up 0.10
    data.setTax(Graph.Supply, 0.20);
    data.setSubsidy(Graph.Supply, 0.10);
    
    assert.deepEqual(data.eq, 55);
    assert.deepEqual(data.ep, 0.65);
  });
  
  QUnit.test("correct domestic total revenue", function(assert) {
    var data = getLinearGraph1();
    
    // net supply movement up 0.10
    data.setTax(Graph.Supply, 0.20);
    data.setSubsidy(Graph.Supply, 0.10);
    
    assert.deepEqual(data.getTotalRevenue().get(),
      Price.get(0.65 * 55));
  });
  
  QUnit.test("correct tax revenue", function(assert) {
    var data = getLinearGraph1();
    
    // net supply movement up 0.10
    var taxAmount = 0.20;
    data.setTax(Graph.Supply, taxAmount);
    data.setSubsidy(Graph.Supply, 0.10);
    
    assert.deepEqual(data.getTaxRevenue().get(),
      Price.get(taxAmount * 55));
  });