"use strict";

/**
 * Helps tests by providing methods to get graphs with certain
 * features (that would likely be used multiple times).
 *
 * Some of these graphs may be difficult to draw out. One may
 * find it easier to use GraphView to draw them in order to
 * see what they look like.
 */

function getLinearGraph1() {
  var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
  var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
  return new EconomyModel(supplyPoints, demandPoints);
} // getLinearGraph1()

// supply is less elastic than demand
function getLinearGraph2() {
  var supplyPoints = "40 0.20 ; 60 0.60 ; 80 1.00";
  var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
  return new EconomyModel(supplyPoints, demandPoints);
} // getLinearGraph2()

function getComplicatedGraph1() {
  var supplyPoints = "10 0.10 ; 40 0.40 ; 50 0.25 ; 80 1.00 ; 120 1.15";
  var demandPoints = "10 1.00 ; 45 0.80 ; 60 0.85 ; 100 0.45";
  return new EconomyModel(supplyPoints, demandPoints);
} // getComplicatedGraph1()