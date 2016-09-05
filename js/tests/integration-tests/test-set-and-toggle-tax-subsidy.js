"use strict";

QUnit.module("mix of setting and toggling tax and subsidy");

  QUnit.test("switch demand tax: correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net movement: demand up 0.10; supply up 0.20
    data.setTax(Graph.Demand, 0.20);
    data.switchTaxedGraph();
    data.setSubsidy(Graph.Demand, 0.10);
    
    assert.deepEqual(data.eq, 60 + 5 - 10);
    assert.deepEqual(data.ep, 0.60 + 0.05 + 0.10);
  });
  
  QUnit.test("switch supply tax: correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net movement: demand down 0.20; supply down 0.10
    data.setTax(Graph.Supply, 0.20);
    data.switchTaxedGraph();
    data.setSubsidy(Graph.Supply, 0.10);
    
    assert.deepEqual(data.eq, 60 - 10 + 5);
    assert.deepEqual(data.ep, 0.60 - 0.10 - 0.05);
  });
  
  QUnit.test("switch demand subsidy: correct equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    // net movement: supply down 0.10
    data.setSubsidy(Graph.Demand, 0.20);
    data.switchSubsidizedGraph();
    data.setSubsidy(Graph.Supply, 0.10);
    
    assert.deepEqual(data.eq, 60 + 5);
    assert.deepEqual(data.ep,
      Price.get(0.60 - 0.05)); // must round here because floating-point error
  });
  
  QUnit.test("switch subsidy and tax: correct equilibrium",
    function(assert)
  {
    var data = getLinearGraph1();
    
    // net movement: supply down 0.20; demand down 0.20
    data.setSubsidy(Graph.Demand, 0.20);
    data.setTax(Graph.Supply, 0.20);
    data.switchSubsidizedGraph();
    data.switchTaxedGraph();
    
    assert.deepEqual(data.eq, 60);
    assert.deepEqual(data.ep, Price.get(0.60 - 0.20));
  });
  
  QUnit.test("switch subsidy and tax: correct equilibrium",
    function(assert)
  {
    var data = getLinearGraph1();
    
    // net movement: supply down 0.10; demand down 0.20
    data.setSubsidy(Graph.Demand, 0.10);
    data.setTax(Graph.Supply, 0.20);
    data.switchSubsidizedGraph();
    data.switchTaxedGraph();
    
    assert.deepEqual(data.eq, 60 + 5 - 10);
    assert.deepEqual(data.ep, Price.get(0.60 - 0.05 - 0.10));
  });
  
  QUnit.test("switch both tax and subsidy: equilibrium check",
    function(assert)
  {
    var data = getLinearGraph1();
    
    // net movement: demand down 0.30; supply down 0.10
    data.setTax(Graph.Supply, 0.30);
    data.switchTaxedGraph();
    data.setSubsidy(Graph.Demand, 0.10);
    data.switchSubsidizedGraph();
    
    assert.deepEqual(data.eq, 60 - 15 + 5);
    assert.deepEqual(data.ep, Price.get(0.60 - 0.15 - 0.05));
  });