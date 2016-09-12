"use strict";

// Is also effectively a set of world price integration tests

QUnit.module("cancel tariff, leaving world price");

  function testCancelTariff(setupNum) {
    switch (setupNum) {
    case 1:
      var data = getLinearGraph1();
      data.setWp(0.45);
      data.setTariffAmount(0.55);
      data.setTariffAmount(0); // the cancellation
      return data;
    default:
      alertAndThrowException("Invalid setupNum");
    }
  }

  QUnit.test("unaffected domestic equilibrium", function(assert) {
    var data = testCancelTariff(1);
    assert.deepEqual(data.eq, 60);
    assert.deepEqual(data.ep, 0.60);
  });
  
  QUnit.test("correct tariff amount", function(assert) {
    var data = testCancelTariff(1);
    assert.deepEqual(data.tariffAmount, 0);
  });
  
  QUnit.test("correct quantity demanded", function(assert) {
    var data = testCancelTariff(1);
    assert.deepEqual(data.qd, 75);
  });
  
  QUnit.test("correct quantity supplied", function(assert) {
    var data = testCancelTariff(1);
    assert.deepEqual(data.qs, 45);
  });
  
  QUnit.test("correct state", function(assert) {
    var data = testCancelTariff(1);
    assert.deepEqual(data.getState(), States.Shortage);
  });
  
  QUnit.test("correct domestic producers' revenue", function(assert) {
    var data = testCancelTariff(1);
    assert.deepEqual(data.getTotalRevenue().get(),
      Price.get(0.45 * 45));
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = testCancelTariff(1);
    
    var handCalculatedCS = (45 - 30) * (0.75 - 0.45)
      + (45 - 30) * (0.90 - 0.75) / 2;
    
    assert.deepEqual(data.getConsumerSurplus().getForTesting(),
      Price.getForTesting(handCalculatedCS));
  });
  
  QUnit.test("correct producer surplus", function(assert) {
    var data = testCancelTariff(1);
    
    var handCalculatedPS = (45 - 30) * (0.45 - 0.30) / 2;
    
    assert.deepEqual(data.getProducerSurplus().getForTesting(),
      Price.getForTesting(handCalculatedPS));
  });
  
  QUnit.test("correct number of imports", function(assert) {
    var data = testCancelTariff(1);
    
    assert.deepEqual(data.getNumberImports(), 30);
  });
  
  QUnit.test("correct tariff revenue", function(assert) {
    var data = testCancelTariff(1);
    
    assert.deepEqual(data.getTariffRevenue().getForTesting(), 0);
  });