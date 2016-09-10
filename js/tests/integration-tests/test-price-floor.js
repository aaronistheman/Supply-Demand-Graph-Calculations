"use strict";

QUnit.module("price floor's amount updated");

  QUnit.test("unchanged domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setPriceMechanismAmount(Mechanism.Floor, 0.70);
    assert.deepEqual(data.eq, 60);
    assert.deepEqual(data.ep, 0.60);
  });
  
  QUnit.test("correct quantity demanded", function(assert) {
    var data = getLinearGraph1();
    
    data.setPriceMechanismAmount(Mechanism.Floor, 0.75);
    assert.deepEqual(data.qd, 45);
  });
  
  QUnit.test("correct quantity supplied", function(assert) {
    var data = getLinearGraph1();
    
    data.setPriceMechanismAmount(Mechanism.Floor, 0.75);
    assert.deepEqual(data.qs, 75);
  });
  
  QUnit.test("correct state", function(assert) {
    var data = getLinearGraph1();
    
    data.setPriceMechanismAmount(Mechanism.Floor, 0.75);
    assert.deepEqual(data.getState(), States.Surplus);
  });
  
  QUnit.test("correct domestic producers' revenue", function(assert) {
    var data = getLinearGraph1();
    var priceFloor = 0.75;
    var qd = 45;
    data.setPriceMechanismAmount(Mechanism.Floor, priceFloor);
    
    assert.deepEqual(data.getTotalRevenue().get,
      Price.get(priceFloor * qd));
  });
  
  QUnit.test("correct consumer surplus", function(assert) {
    var data = getLinearGraph1();
    data.setPriceMechanismAmount(Mechanism.Floor, 0.75);
    
    var handCalculatedCS = (45 - 30) * (0.90 - 0.75) / 2;
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      Price.get(handCalculatedCS));
  });
  
  QUnit.test("correct producer surplus", function(assert) {
    var data = getLinearGraph1();
    data.setPriceMechanismAmount(Mechanism.Floor, 0.75);
    
    var handCalculatedPS = (45 - 30) * (0.75 - 0.45)
      + (45 - 30) * (0.45 - 0.30) / 2;
    
    assert.deepEqual(data.getProducerSurplus.get(),
      Price.get(handCalculatedPS));
  });