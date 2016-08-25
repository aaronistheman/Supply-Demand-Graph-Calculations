"use strict";

var currentTestedFile = "utility/quantity.js";

QUnit.module(currentTestedFile + ", Quantity.prototype.get()");

  QUnit.test("correct return", function(assert) {
    var q = new Quantity(3.63);
    assert.deepEqual(q.get(), 4);
  });

QUnit.module(currentTestedFile + ", Quantity.prototype.getUnrounded()");

  QUnit.test("correct return", function(assert) {
    var q = new Quantity(3.63);
    assert.deepEqual(q.getUnrounded(), 3.63);
  });
  
QUnit.module(currentTestedFile + ", Quantity.get()");

  QUnit.test("correct return", function(assert) {
    var q = Quantity.get(3.634529);
    assert.deepEqual(q, 4);
  });