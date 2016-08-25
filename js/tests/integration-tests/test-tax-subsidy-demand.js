"use strict";

QUnit.module("tax and subsidy both on demand");

  QUnit.test("correct equilibrium", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net demand movement up 0.30
    data.setTax(Graph.Demand, 0.15);
    data.setSubsidy(Graph.Demand, 0.45);
    
    assert.deepEqual(data.eq, 75);
    assert.deepEqual(data.ep, 0.75);
  });

  QUnit.test("correct domestic total revenue", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net demand movement up 0.18
    data.setTax(Graph.Demand, 0.23);
    data.setSubsidy(Graph.Demand, 0.41);
    
    assert.deepEqual(data.getTotalRevenue().get(),
      47.61); // hand-calculated
  });

  QUnit.test("correct equilibrium", function(assert) {
    var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
    var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    // net demand movement: down 0.10
    data.setTax(Graph.Demand, 0.20);
    data.setSubsidy(Graph.Demand, 0.10);
    
    assert.deepEqual(data.eq, 55);
    assert.deepEqual(data.ep, 0.55);
  });