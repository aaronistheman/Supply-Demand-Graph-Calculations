"use strict";

QUnit.module("mix of setting and toggling tax and subsidy");

  QUnit.test("switch demand tax: correct equilibrium", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net movement: demand up 0.10; supply up 0.20
    data.setTax(Graph.Demand, 0.20);
    data.switchTaxedGraph();
    data.setSubsidy(Graph.Demand, 0.10);
    
    assert.deepEqual(data.eq, 60 + 5 - 10);
    assert.deepEqual(data.ep, 0.60 + 0.05 + 0.10);
  });
  
  QUnit.test("switch both tax and subsidy: equilibrium check",
    function(assert)
  {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net movement: demand down 0.30; supply down 0.10
    data.setTax(Graph.Supply, 0.30);
    data.switchTaxedGraph();
    data.setSubsidy(Graph.Demand, 0.10);
    data.switchSubsidizedGraph();
    
    assert.deepEqual(data.eq, 60 - 15 + 5);
    assert.deepEqual(data.ep, Price.get(0.60 - 0.15 - 0.05));
  });