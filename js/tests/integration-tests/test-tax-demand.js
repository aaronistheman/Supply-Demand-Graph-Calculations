"use strict";

QUnit.module("tax on demand");

  QUnit.test("correct domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.45);
  });

  /* Has rounding issue:
  QUnit.test("correct consumer surplus",
    function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Demand, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  */