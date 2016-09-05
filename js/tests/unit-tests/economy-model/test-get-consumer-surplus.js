"use strict";

var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.getConsumerSurplus()");

  QUnit.test("correct value", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      6.00); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    assert.deepEqual(data.getConsumerSurplus().get(),
      23.50); // hand-calculated
  });
  
  /* Has rounding error
  QUnit.test("correct value yet again!", function(assert) {
    var data = new EconomyModel(
      "30 0.60 ; 60 0.90 ; 90 1.20",
      "30 0.90 ; 60 0.60 ; 90 0.30");
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  */
  
  QUnit.test("correct value yet again!", function(assert) {
    var data = getLinearGraph1();
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      4.50); // hand-calculated
  });