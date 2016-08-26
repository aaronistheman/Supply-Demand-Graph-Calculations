"use strict";

/**
 * Helps tests by providing methods to get graphs with certain
 * features (that would likely be used multiple times).
 */

function getLinearGraph1() {
  var supplyPoints = "30 0.30 ; 60 0.60 ; 90 0.90";
  var demandPoints = "30 0.90 ; 60 0.60 ; 90 0.30";
  return new EconomyModel(supplyPoints, demandPoints);
} // getLinearGraph1()