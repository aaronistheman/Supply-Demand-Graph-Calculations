"use strict";

QUnit.module("switch price ceiling/floor off");

  function testCancelPriceMechanism(setupNum) {
    switch (setupNum) {
    case 1: // switch from ceiling to none
      var data = getLinearGraph1();
      data.setPriceMechanismAmount(Mechanism.Ceiling, 0.43);
      data.switchPriceMechanism(Mechanism.None);
      return data;
    case 2: // switch from floor to none
      var data = getLinearGraph1();
      data.setPriceMechanismAmount(Mechanism.Floor, 0.68);
      data.switchPriceMechanism(Mechanism.None);
      return data;
    default:
      alertAndThrowException("Invalid setupNum");
    }
  } // testCancelPriceMechanism
  
  QUnit.test("correct price mechanism amount", function(assert) {
    var data = testCancelPriceMechanism(1);
    
    assert.deepEqual(data.pmAmount, 0);
  });
  
  QUnit.test("correct price mechanism amount", function(assert) {
    var data = testCancelPriceMechanism(2);
    
    assert.deepEqual(data.pmAmount, 0);
  });
  
  QUnit.test("correct quantity demanded", function(assert) {
    var data = testCancelPriceMechanism(1);
    
    assert.deepEqual(data.qd, 60)
  });
  
  QUnit.test("correct quantity supplied", function(assert) {
    var data = testCancelPriceMechanism(1);
    
    assert.deepEqual(data.qs, 60);
  });
  
  QUnit.test("correct quantity demanded", function(assert) {
    var data = testCancelPriceMechanism(2);
    
    assert.deepEqual(data.qd, 60)
  });
  
  QUnit.test("correct quantity supplied", function(assert) {
    var data = testCancelPriceMechanism(2);
    
    assert.deepEqual(data.qs, 60);
  });