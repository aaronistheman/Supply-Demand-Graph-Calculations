"use strict";

var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.getProducerSurplus()");

  QUnit.test("correct value", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    assert.deepEqual(data.getProducerSurplus().get(),
      4.50); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    assert.deepEqual(data.getProducerSurplus().get(),
      16.00); // hand-calculated
  });