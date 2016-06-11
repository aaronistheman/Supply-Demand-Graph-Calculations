"use strict";

var currentTestedFile = "string-input.js";

QUnit.module(currentTestedFile + ", StringInput.getChar()");

  QUnit.test("correct return", function(assert) {
    var sin = new StringInput("abcd");
    assert.deepEqual(sin.getChar(), 'a');
  });

  QUnit.test("advances stream", function(assert) {
    var sin = new StringInput("abcd");
    sin.getChar();
    assert.deepEqual(sin.getChar(), 'b');
  });

  QUnit.test("returns empty string if nothing left", function(assert) {
    var sin = new StringInput("ab");
    sin.getChar();
    sin.getChar();
    assert.deepEqual(sin.getChar(), '');
  });

QUnit.module(currentTestedFile + ", StringInput.getCharsUntil()");

  QUnit.test("gets chars until reaches stopper", function(assert) {
    var sin = new StringInput("abcdefgh");
    var str = sin.getCharsUntil('e');
    assert.deepEqual(str, "abcd", "Correct string returned");
    assert.deepEqual(sin.getChar(), 'e', "Advanced appropriately");
  });

QUnit.module(currentTestedFile + ", StringInput.ignore()");

  QUnit.test("ignores appropriate chars", function(assert) {
    var sin = new StringInput("aaaabaacd");
    sin.ignore('a');
    assert.deepEqual(sin.getChar(), 'b');
  });

  QUnit.test("can ignore nothing", function(assert) {
    var sin = new StringInput("abcd");
    sin.ignore('b');
    assert.deepEqual(sin.getChar(), 'a');
  });

QUnit.module(currentTestedFile + ", StringInput.ignoreUntil()");

  QUnit.test("ignores until appropriate char", function(assert) {
    var sin = new StringInput("abcdef");
    sin.ignoreUntil('d');
    assert.deepEqual(sin.getChar(), 'd');
  });

QUnit.module(currentTestedFile + ", StringInput.isAtEnd()");

  QUnit.test("knows when end's reached", function(assert) {
    var sin = new StringInput("abc");
    sin.ignoreUntil('d');
    assert.ok(sin.isAtEnd());
  });

currentTestedFile = "piecewise-function.js";
QUnit.module(currentTestedFile + ", PiecewiseFunction.getY()");

  QUnit.test("returns correct y-value", function(assert) {
    // I'll use an integer slope to make things easier to check
    var pf = new PiecewiseFunction();
    pf.insert(new Point(5, 8));
    pf.insert(new Point(9, 16));

    assert.deepEqual(pf.getY(8), 14);
  });

QUnit.module(currentTestedFile + ", Riemann sum methods");

  // Note that testing 1,000,000 rectangles makes the tests take
  // seconds longer
  var numRectsArray = [10, 100, 500, 1000, 5000, 10000,
    // 100000, 500000, 1000000];
    100000, 500000];

  function setUpRiemannTest(caseNum) {
    switch (caseNum) {
    case 1:
      var pf = new PiecewiseFunction();
      pf.insert(new Point(1.00, 10));
      pf.insert(new Point(1.25, 20));
      pf.insert(new Point(1.45, 40));

      var returnObj = {};
      returnObj.pf = pf;
      returnObj.answer = 9.75; // hand calculated
      return returnObj;
    }
  }

  QUnit.test("left sum is lower than real for increasing function",
    function(assert) {
    var obj = setUpRiemannTest(1);
    var pf = obj.pf;

    for (var i = 0; i < numRectsArray.length; ++i) {
      pf.setNumRectangles(numRectsArray[i]);
      var sum = pf.getLeftRiemannSum(1.00, 1.45);
      // console.log(numRectsArray[i] + " " + sum);
      assert.ok(sum < obj.answer,
        "Correct for " + numRectsArray[i] + " rectangles");
    }
  });

  QUnit.test("right sum is higher than real for increasing function",
    function(assert) {
    var obj = setUpRiemannTest(1);
    var pf = obj.pf;

    for (var i = 0; i < numRectsArray.length; ++i) {
      pf.setNumRectangles(numRectsArray[i]);
      var sum = pf.getRightRiemannSum(1.00, 1.45);
      // console.log(numRectsArray[i] + " " + sum);
      assert.ok(sum > obj.answer,
        "Correct for " + numRectsArray[i] + " rectangles");
    }
  });

currentTestedFile = "graph.js";
QUnit.module(currentTestedFile + ", calculateHighestQuantity()");

  QUnit.test("returns last demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var graph = new Graph(supplyPoints, demandPoints);
    
    assert.deepEqual(graph.calculateHighestQuantity(), 103);
  });

  QUnit.test("returns last supply quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var graph = new Graph(supplyPoints, demandPoints);
    
    assert.deepEqual(graph.calculateHighestQuantity(), 103);
  });

QUnit.module(currentTestedFile + ", getEquilibriumPoint()");

  QUnit.test("correct point found", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var graph = new Graph(supplyPoints, demandPoints);
    
    var eqPoint = graph.getEquilibriumPoint();
    assert.deepEqual(eqPoint.x, 90);
    assert.deepEqual(eqPoint.y, 0.75);
  });