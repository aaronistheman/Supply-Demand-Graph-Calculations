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
  ", PiecewiseFunction.prototype.getQ()");
  
  QUnit.test("correct value going forward", function(assert) {
    var pf = new PiecewiseFunction();
    pf.insert(new Point(3, 0.30));
    pf.insert(new Point(5, 0.50));
    pf.insert(new Point(9, 0.90));
    
    var quantity = pf.getQ(0.80, 6, 9, 500,
      function(a,b) { return a < b; });
    assert.deepEqual(quantity, 8);
  });
  
  QUnit.test("correct value going forward #2", function(assert) {
    // zig-zagging function
    var pf = new PiecewiseFunction();
    pf.insert(new Point(2, 0.30));
    pf.insert(new Point(4, 0.60));
    pf.insert(new Point(6, 0.30));
    pf.insert(new Point(8, 0.60));
    pf.insert(new Point(10, 0.30));
    pf.insert(new Point(12, 0.60));
    pf.insert(new Point(14, 0.30));
    
    var quantity = pf.getQ(0.45, 4, 12, 500,
      function(a,b) { return a > b; }); 
    assert.deepEqual(quantity, 5);
  });
  
  QUnit.test("correct value going backward", function(assert) {
    var pf = new PiecewiseFunction();
    pf.insert(new Point(3, 0.30));
    pf.insert(new Point(7, 0.70));
    pf.insert(new Point(9, 0.90));
    
    var quantity = pf.getQ(0.40, 6, 3, 500,
      function(a,b) { return a > b; });
    assert.deepEqual(quantity, 4);
  });
  
  QUnit.test("correct value going backward #2", function(assert) {
    // zig-zagging function
    var pf = new PiecewiseFunction();
    pf.insert(new Point(2, 0.30));
    pf.insert(new Point(4, 0.60));
    pf.insert(new Point(6, 0.30));
    pf.insert(new Point(8, 0.60));
    pf.insert(new Point(10, 0.30));
    pf.insert(new Point(12, 0.60));
    pf.insert(new Point(14, 0.30));
    
    var quantity = pf.getQ(0.45, 10, 4, 500,
      function(a,b) { return a < b; }); 
    assert.deepEqual(quantity, 9);
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