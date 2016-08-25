"use strict";

var currentTestedFile = "model/piecewise-function.js";

QUnit.module(currentTestedFile +
  ", PiecewiseFunction.prototype.getP()");

  QUnit.test("returns correct price", function(assert) {
    var pf = new PiecewiseFunction();
    pf.insert(new Point(5, 8));
    pf.insert(new Point(9, 16));
    
    var price = pf.getP(8);
    assert.deepEqual(price, 14);
  });
  
  QUnit.test("returns correct price #2", function(assert) {
    var pf = new PiecewiseFunction();
    pf.insert(new Point(1, 7));
    pf.insert(new Point(5, 6));
    pf.insert(new Point(7, 4));
    pf.insert(new Point(9, 3));
    
    var price = pf.getP(8);
    assert.deepEqual(price, 3.50);
  });
  
  QUnit.test("returns correct offset price #1", function(assert) {
    var pf = new PiecewiseFunction();
    pf.insert(new Point(5, 8));
    pf.insert(new Point(9, 16));
    
    var price = pf.getP(8, 2.30);
    assert.deepEqual(price, 16.30);
  });
  
  QUnit.test("returns correct offset price #2", function(assert) {
    var pf = new PiecewiseFunction();
    pf.insert(new Point(1, 7));
    pf.insert(new Point(5, 6));
    pf.insert(new Point(7, 4));
    pf.insert(new Point(9, 3));
    
    var price = pf.getP(8, -1.10);
    assert.deepEqual(price, 2.40);
  });

QUnit.module(currentTestedFile +
  ", PiecewiseFunction.prototype.insert()");

  QUnit.test("error-checking works", function(assert) {
    var caughtError = false;
    var pf = new PiecewiseFunction();
    pf.insert(new Point(5, 8));
    try {
      pf.insert(new Point(4, 9));
    }
    catch (err) {
      caughtError = true;
    }
    assert.ok(caughtError, "Successfully caught error");
  });