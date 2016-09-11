"use strict";

QUnit.module("switch price floor to ceiling");

  function testSwitchFloorToCeilingSetUp(setupNum) {
    switch (setupNum) {
    case 1:
      var data = getLinearGraph1();
      data.setPriceMechanismAmount(Mechanism.Floor, 0.75);
      data.switchPriceMechanism();
      return data;
    default:
      alertAndThrowException("Invalid setupNum");
    }
  }
  
  QUnit.test("correct price mechanism amount", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.pmAmount, 0);
  });

  QUnit.test("unchanged domestic equilibrium", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.eq, 60);
    assert.deepEqual(data.ep, 0.60);
  });
  
  QUnit.test("correct quantity demanded", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.qd, 60)
  });
  
  QUnit.test("correct quantity supplied", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
  });
  
  QUnit.test("correct state", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.qs, 60)
  });
  
  QUnit.test("correct domestic producers' revenue", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.getTotalRevenue().get(),
      Price.get(60 * 0.60));
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.getConsumerSurplus.getForTesting(),
      Price.getForTesting((60 - 30) * (0.90 - 0.60) / 2));
  });
  
  QUnit.test("correct producer surplus", function(assert) {
    var data = testSwitchFloorToCeilingSetUp(1);
    
    assert.deepEqual(data.getProducerSurplus.getForTesting(),
      Price.getForTesting((60 - 30) * (0.60 - 0.30) / 2));
  });