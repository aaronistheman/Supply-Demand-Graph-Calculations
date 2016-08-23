var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateWorldQs()");

  QUnit.test("correct value is a given quantity", function(assert) {
    var data = new EconomyModel(
      "7 65; 8 80; 10 100; 12 120; 13 130",
      "8 120; 10 100; 12 80; 13 70");
    
    data.wp = 80;
    var result = Quantity.get(data.calculateWorldQs());
    assert.deepEqual(result, 8); // correct value is from a point on the graph
  });
  
  QUnit.test("correct value isn't a given quantity", function(assert) {
    var data = new EconomyModel(
      "40 0.50; 80 1.00; 100 1.50",
      "80 1.50; 100 1.00");
    
    data.wp = 0.75;
    var result = Quantity.get(data.calculateWorldQs());
    assert.deepEqual(result, 60); // correct value isn't a point
  });