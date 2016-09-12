"use strict";

var currentTestedFile = "utility/price.js";

QUnit.module(currentTestedFile + ", Price.prototype.get()");

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.789222);
    assert.deepEqual(p.get(), 5.79);
  });

QUnit.module(currentTestedFile + ", Price.prototype.getUnrounded()");

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.789222);
    assert.deepEqual(p.getUnrounded(), 5.789222);
  });

QUnit.module(currentTestedFile + ", Price.prototype.forDisplay()");

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.7);
    assert.deepEqual(p.forDisplay(), "$5.70");
  });

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.789222);
    assert.deepEqual(p.forDisplay(), "$5.79");
  });

QUnit.module(currentTestedFile + ", Price.get()");

  QUnit.test("correct return", function(assert) {
    var p = Price.get(5.789222);
    assert.deepEqual(p, 5.79);
  });

QUnit.module(currentTestedFile + ", Price.forDisplay()");

  QUnit.test("correct return", function(assert) {
    var p = Price.forDisplay(2.8351);
    assert.deepEqual(p, "$2.84");
  });

  QUnit.test("correct return #2", function(assert) {
    var p = Price.forDisplay(5.7);
    assert.deepEqual(p, "$5.70");
  });

QUnit.module(currentTestedFile + ", Price.getForTesting()");

  QUnit.test("correct return", function(assert) {
    var p = Price.getForTesting(5.567822);
    assert.deepEqual(p, 5.568);
  });