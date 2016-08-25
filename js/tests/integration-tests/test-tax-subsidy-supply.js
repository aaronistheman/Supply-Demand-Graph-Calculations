"use strict";

QUnit.module("tax and subsidy both on supply");

  QUnit.test("correct equilibrium", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net supply movement: down 0.30
    data.setTax(Graph.Supply, 0.15);
    data.setSubsidy(Graph.Supply, 0.45);
    
    assert.deepEqual(data.eq, 75);
    assert.deepEqual(data.ep, 0.45);
  });

  QUnit.test("correct equilibrium", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net supply movement: up 0.10
    data.setTax(Graph.Supply, 0.20);
    data.setSubsidy(Graph.Supply, 0.10);
    
    assert.deepEqual(data.eq, 55);
    assert.deepEqual(data.ep, 0.65);
  });