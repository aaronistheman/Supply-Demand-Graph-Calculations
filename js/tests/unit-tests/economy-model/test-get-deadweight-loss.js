"use strict";

var file = "model/economy-model.js";

QUnit.module(file +
  ", EconomyModel.prototype.getDeadweightLoss()");
  
  QUnit.test("zero by default", function(assert) {
    var data = getLinearGraph1();
    assert.deepEqual(data.getDeadweightLoss().get(), 0.00);
  });