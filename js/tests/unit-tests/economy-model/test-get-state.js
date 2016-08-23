var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile + ", EconomyModel.prototype.getState()");

  QUnit.test("correctly detected equilibrium", function(assert) {
    var data = new EconomyModel(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
    
    // nothing special has happened, so should be equilibrium
    assert.deepEqual(data.getState(), States.Equilibrium);
  });