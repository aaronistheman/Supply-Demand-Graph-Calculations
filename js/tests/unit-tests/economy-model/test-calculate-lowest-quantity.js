var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
  ", EconomyModel.prototype.calculateLowestQuantity()");

  QUnit.test("returns first demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "45 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestQuantity(), 45);
  });

  QUnit.test("returns first supply quantity", function(assert) {
    var supplyPoints = "45 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestQuantity(), 45);
  });