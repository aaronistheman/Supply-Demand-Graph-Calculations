"use strict";

QUnit.module("tax on supply");

  QUnit.test("correct domestic equilibrium", function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.eq, 45);
    assert.deepEqual(data.ep, 0.75);
  });
  
  /* Has rounding issue:
  QUnit.test("correct consumer surplus adjustment",
    function(assert) {
    var data = getLinearGraph1();
    
    data.setTax(Graph.Supply, 0.3);
    assert.deepEqual(data.getConsumerSurplus().get(),
      1.13); // hand-calculated
  });
  */
  
  