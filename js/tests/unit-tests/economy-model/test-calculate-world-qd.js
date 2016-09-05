"use strict";

var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateWorldQd()");

  QUnit.test("correct value is a given quantity", function(assert) {
    var data = new EconomyModel(
      "8 80; 10 100; 12 120; 13 130",
      "8 120; 10 100; 12 80; 13 70");
    
    data.wp = 80;
    var result = Quantity.get(data.calculateWorldQd());
    assert.deepEqual(result, 12); // correct value is from a point on the graph
  });

  QUnit.test("correct value isn't a given quantity", function(assert) {
    var data = new EconomyModel(
      "40 1; 60 1.50;",
      "40 1.50; 60 1.00; 100 0.50");
    
    data.wp = 0.75;
    var result = Quantity.get(data.calculateWorldQd());
    assert.deepEqual(result, 80); // correct value isn't from a point
  });