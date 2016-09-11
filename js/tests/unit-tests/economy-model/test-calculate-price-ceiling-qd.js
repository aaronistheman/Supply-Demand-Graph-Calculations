"use strict";

var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculatePriceCeilingQd()");
  
  QUnit.test("correct error value if extrapolation", function(assert) {
    var data = getLinearGraph1();
    
    data.pmAmount = 0.25; // lowest point is 0.30
    assert.deepEqual(data.calculatePriceCeilingQd(), undefined);
  });
  
  QUnit.test("correct value", function(assert) {
    var data = getLinearGraph1();
    data.pmAmount = 0.45;
    assert.deepEqual(Quantity.get(data.calculatePriceCeilingQd()), 75);
  });