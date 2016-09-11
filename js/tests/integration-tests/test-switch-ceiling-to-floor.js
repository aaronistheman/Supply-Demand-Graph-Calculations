"use strict";

QUnit.module("switch price ceiling to floor");

  function testSwitchCeilingToFloorSetUp(setupNum) {
    switch (setupNum) {
    case 1:
      var data = getLinearGraph1();
      data.setPriceMechanismAmount(Mechanism.Ceiling, 0.45);
      data.switchPriceMechanism(Mechanism.Floor);
      return data;
    default:
      alertAndThrowException("Invalid setupNum");
    }
  }
  
  QUnit.test("correct price mechanism amount", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.pmAmount, 0);
  });

  QUnit.test("unchanged domestic equilibrium", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.eq, 60);
    assert.deepEqual(data.ep, 0.60);
  });
  
  QUnit.test("correct quantity demanded", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.qd, 60)
  });
  
  QUnit.test("correct quantity supplied", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.qs, 60);
  });
  
  QUnit.test("correct state", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.getState(), States.Equilibrium);
  });
  
  QUnit.test("correct domestic producers' revenue", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.getTotalRevenue().get(),
      Price.get(60 * 0.60));
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.getConsumerSurplus().getForTesting(),
      Price.getForTesting((60 - 30) * (0.90 - 0.60) / 2));
  });
  
  QUnit.test("correct producer surplus", function(assert) {
    var data = testSwitchCeilingToFloorSetUp(1);
    
    assert.deepEqual(data.getProducerSurplus().getForTesting(),
      Price.getForTesting((60 - 30) * (0.60 - 0.30) / 2));
  });