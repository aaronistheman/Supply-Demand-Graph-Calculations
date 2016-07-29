"use strict";

/**
 * Note: In many of the QUnit module's names, I didn't use "prototype"
 * where I maybe should've (e.g. "StringInput.getChar()" really means
 * "StringInput.prototype.getChar()"). However, this might've been
 * a good way to accidentally save space.
 */

var currentTestedFile = undefined;

currentTestedFile = "utility/quantity.js";
QUnit.module(currentTestedFile + ", Quantity.get()");

  QUnit.test("correct return", function(assert) {
    var q = new Quantity(3.63);
    assert.deepEqual(q.get(), 4);
  });

QUnit.module(currentTestedFile + ", Quantity.getUnrounded()");

  QUnit.test("correct return", function(assert) {
    var q = new Quantity(3.63);
    assert.deepEqual(q.getUnrounded(), 3.63);
  });

currentTestedFile = "utility/price.js";
QUnit.module(currentTestedFile + ", Price.get()");

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.789222);
    assert.deepEqual(p.get(), 5.79);
  });

QUnit.module(currentTestedFile + ", Price.getUnrounded()");

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.789222);
    assert.deepEqual(p.getUnrounded(), 5.789222);
  });

QUnit.module(currentTestedFile + ", Price.forDisplay()");

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.7);
    assert.deepEqual(p.forDisplay(), "5.70");
  });

  QUnit.test("correct return", function(assert) {
    var p = new Price(5.789222);
    assert.deepEqual(p.forDisplay(), "5.79");
  });

currentTestedFile = "model/data.js";
QUnit.module(currentTestedFile + ", Data.calculateEquilibriumPoint()");

  // In this test, the intersection point is (by intention)
  // a given point
  QUnit.test("correct point found", function(assert) {    
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new Data(supplyPoints, demandPoints);
    var eqPoint = data.calculateEquilibriumPoint();
    
    assert.deepEqual(eqPoint.q(), 90);
    assert.deepEqual(eqPoint.p(), 0.75);
  });

  // In this test, the intersection point isn't a given point
  QUnit.test("correct point found again!", function(assert) {  
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.70 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.75 ; 80 0.25 ; 110 0.20";
    var data = new Data(supplyPoints, demandPoints);
    var eqPoint = data.calculateEquilibriumPoint()
    
    assert.deepEqual(eqPoint.q(), 70);
    assert.deepEqual(eqPoint.p(), 0.50);
  });

QUnit.module(currentTestedFile + ", Data.calculateHighestQuantity()");

  QUnit.test("returns last demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var data = new Data(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateHighestQuantity(), 103);
  });

  QUnit.test("returns last supply quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new Data(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateHighestQuantity(), 103);
  });

QUnit.module(currentTestedFile + ", Data.calculateLowestQuantity()");

  QUnit.test("returns first demand quantity", function(assert) {
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "45 1.25 ; 60 0.90 ; 90 0.75 ; 103 0.30";
    var data = new Data(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestQuantity(), 45);
  });

  QUnit.test("returns first supply quantity", function(assert) {
    var supplyPoints = "45 0.25 ; 50 0.30 ; 90 0.75 ; 103 1.35";
    var demandPoints = "40 1.25 ; 60 0.90 ; 90 0.75 ; 110 0.30";
    var data = new Data(supplyPoints, demandPoints);
    
    assert.deepEqual(data.calculateLowestQuantity(), 45);
  });
  
QUnit.module(currentTestedFile + ", Data.getConsumerSurplus()")

  QUnit.test("correct value", function(assert) {
    var data = new Data(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    assert.deepEqual(data.getConsumerSurplus().get(),
      6.00); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var data = new Data(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    assert.deepEqual(data.getConsumerSurplus().get(),
      23.50); // hand-calculated
  });

QUnit.module(currentTestedFile + ", Data.getProducerSurplus()");

  QUnit.test("correct value", function(assert) {
    var data = new Data(
      "20 0.2; 50 0.5; 90 0.9",
      "20 0.9; 50 0.5 ; 80 0.2");
    
    assert.deepEqual(data.getProducerSurplus().get(),
      4.50); // hand-calculated
  });

  QUnit.test("correct value again!", function(assert) {
    var data = new Data(
      "20 0.2; 70 0.6; 110, 0.8",
      "10 1.50; 20 1.30; 40 1.20; 100 0.60");
      
    assert.deepEqual(data.getProducerSurplus().get(),
      16.00); // hand-calculated
  });

currentTestedFile = "model/string-input.js";
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
QUnit.module(currentTestedFile + ", PiecewiseFunction.getP()");

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