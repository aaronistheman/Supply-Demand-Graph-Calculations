"use strict";

var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateHighestQuantity()");

  QUnit.test("returns last demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateHighestQuantity(), 103);
  });

  QUnit.test("returns last supply quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateHighestQuantity(), 103);
  });