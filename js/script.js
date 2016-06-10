"use strict";

function graphSupply(inputString) {
  var canvas = document.getElementById("graph");
  var ctx = canvas.getContext("2d");
  // ctx.fillStyle = "black";
  // ctx.fillRect(30, 30, 150, 75);

  var maxX = 120;
  var maxY = 1.50;

  var q = -1;
  var p = -1;
  var qString = "";
  var pString = "";
  for (var i in inputString) { // for each char in input string

  }
} // graphSupply()

$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    var supplyPoints = "40 0.25 ; 90 0.75 ; 110 1.35";

    graphSupply(supplyPoints);
  }
}); // document ready function