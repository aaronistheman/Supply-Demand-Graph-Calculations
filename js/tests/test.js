"use strict";

var currentTestedFile = "model/string-input.js";

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

currentTestedFile = "model/piecewise-function.js";
QUnit.module(currentTestedFile + ", PiecewiseFunction.getY()");

  /*
  QUnit.test("returns correct y-value", function(assert) {
    // I'll use an integer slope to make things easier to check
    var pf = new PiecewiseFunction();
    pf.insert(new Point(5, 8));
    pf.insert(new Point(9, 16));

    assert.deepEqual(pf.getY(8).q(), 14);
  });
  */
  
QUnit.module(currentTestedFile + ", PiecewiseFunction.insert()");

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

/*
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

QUnit.module(currentTestedFile + ", calculateLowestQuantity()");

  QUnit.test("returns first demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "45 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var graph = new Graph(supplyPoints, demandPoints);
    
    assert.deepEqual(graph.calculateLowestQuantity(), 45);
  });

  QUnit.test("returns first supply quantity", function(assert) {
    var supplyPoints = "45 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var graph = new Graph(supplyPoints, demandPoints);
    
    assert.deepEqual(graph.calculateLowestQuantity(), 45);
  });

QUnit.module(currentTestedFile + ", calculateEquilibriumPoint()");

  QUnit.test("correct point found", function(assert) {
    // In this test, the intersection point is (pretty much
    // a given point
    
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var graph = new Graph(supplyPoints, demandPoints);
    
    // Get the point and do appropriate rounding to make unit
    // testing more useful
    var eqPoint = graph.calculateEquilibriumPoint();
    // console.log("eqPoint x=" + eqPoint.x + " eqPoint y=" + eqPoint.y);
    eqPoint.x = Math.round(eqPoint.x);
    eqPoint.y = Math.round(eqPoint.y * 100) / 100;
    
    assert.deepEqual(eqPoint.x, 90);
    assert.deepEqual(eqPoint.y, 0.75);
  });

  QUnit.test("correct point found again!", function(assert) {
    // In this test, the intersection point isn't a given point
    
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.70 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.75 ; 80 0.25 ; 110 0.20";
    var graph = new Graph(supplyPoints, demandPoints);
    
    // Get the point and do appropriate rounding to make unit
    // testing more useful
    var eqPoint = graph.calculateEquilibriumPoint();
    eqPoint.x = Math.round(eqPoint.x);
    eqPoint.y = Math.round(eqPoint.y * 100) / 100;
    
    assert.deepEqual(eqPoint.x, 70);
    assert.deepEqual(eqPoint.y, 0.50);
  });
  
QUnit.module(currentTestedFile + ", getConsumerSurplus()")

  QUnit.test("correct value", function(assert) {
    var graph = new Graph(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    var cs = Math.round(graph.getConsumerSurplus() * 100) / 100;
    assert.deepEqual(cs, 6); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var graph = new Graph(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    var cs = Math.round(graph.getConsumerSurplus() * 100) / 100;
    assert.deepEqual(cs, 23.50); // hand-calculated
  });

QUnit.module(currentTestedFile + ", getProducerSurplus()");

  QUnit.test("correct value", function(assert) {
    var graph = new Graph(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    var ps = Math.round(graph.getProducerSurplus() * 100) / 100;
    assert.deepEqual(ps, 4.50); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var graph = new Graph(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    var ps = Math.round(graph.getProducerSurplus() * 100) / 100;
    assert.deepEqual(ps, 16.00); // hand-calculated
  });

QUnit.module(currentTestedFile + ", determineWorldQD()");

  QUnit.test("correct value is a given quantity", function(assert) {
    var graph = new Graph(
      "8 80; 10 100; 12 120; 13 130",
      "8 120; 10 100; 12 80; 13 70");
    
    graph.setWp(80);
    var result = Math.round(graph.determineWorldQD());
    assert.deepEqual(result, 12); // correct value is from a point on the graph
  });

  QUnit.test("correct value isn't a given quantity", function(assert) {
    var graph = new Graph(
      "40 1; 60 1.50;",
      "40 1.50; 60 1.00; 100 0.50");
    
    graph.setWp(0.75);
    var result = Math.round(graph.determineWorldQD());
    assert.deepEqual(result, 80); // correct value isn't from a point
  });

QUnit.module(currentTestedFile + ", determineWorldQS()");

  QUnit.test("correct value is a given quantity", function(assert) {
    var graph = new Graph(
      "7 65; 8 80; 10 100; 12 120; 13 130",
      "8 120; 10 100; 12 80; 13 70");
    
    graph.setWp(80);
    var result = Math.round(graph.determineWorldQS());
    assert.deepEqual(result, 8); // correct value is from a point on the graph
  });
  
  QUnit.test("correct value isn't a given quantity", function(assert) {
    var graph = new Graph(
      "40 0.50; 80 1.00; 100 1.50",
      "80 1.50; 100 1.00");
    
    graph.setWp(0.75);
    var result = Math.round(graph.determineWorldQS());
    assert.deepEqual(result, 60); // correct value isn't a point
  });
*/