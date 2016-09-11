"use strict";

QUnit.module("tax demand, subsidy on supply");

  QUnit.test("correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.15);
    data.setSubsidy(Graph.Supply, 0.15);
    
    assert.deepEqual(data.eq, 60);
    assert.deepEqual(data.ep, 0.45);
  });

  QUnit.test("correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.15);
    data.setSubsidy(Graph.Supply, 0.30);
    
    // hand-determined
    assert.deepEqual(data.eq, 68);
    assert.deepEqual(data.ep, 0.38);
  });