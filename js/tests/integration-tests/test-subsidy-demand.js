"use strict";

QUnit.module("subsidy on demand");

  QUnit.test("correct domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setSubsidy(Graph.Demand, 0.2);
    assert.deepEqual(data.eq, 70);
    assert.deepEqual(data.ep, 0.70);
  });
  
  QUnit.test("corerct quantity demanded/supplied", function(assert) {
    var data = getLinearGraph1();
    
    data.setSubsidy(Graph.Demand, 0.2);
    assert.deepEqual(data.qd, 70);
    assert.deepEqual(data.qs, 70);
  });
  
  QUnit.test("correct domestic total revenue", function(assert) {
    var data = getLinearGraph1();
    
    data.setSubsidy(Graph.Demand, 0.2);
    var answer = Price.get(70 * 0.70);
    assert.deepEqual(data.getTotalRevenue().get(), answer);
  });