var currentTestedFile = "model/economy-model.js";

QUnit.module(currentTestedFile +
 ", EconomyModel.prototype.calculateEquilibriumPoint()");

  // In this test, the intersection point is (by intention)
  // a given point
  QUnit.test("correct point found", function(assert) {    
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new EconomyModel(supplyPoints, demandPoints);
    var eqPoint = data.calculateEquilibriumPoint();
    
    assert.deepEqual(eqPoint.q(), 90);
    assert.deepEqual(eqPoint.p(), 0.75);
  });

  // In this test, the intersection point isn't a given point
  QUnit.test("correct point found again!", function(assert) {  
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.70 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.75 ; 80 0.25 ; 110 0.20";
    var data = new EconomyModel(supplyPoints, demandPoints);
    var eqPoint = data.calculateEquilibriumPoint()
    
    assert.deepEqual(eqPoint.q(), 70);
    assert.deepEqual(eqPoint.p(), 0.50);
  });