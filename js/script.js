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
  var qArray = [];
  var pArray = [];
  var sin = new StringInput(inputString);
  while (!sin.isAtEnd()) {
    // get q
    sin.ignore(' ');
    qString = sin.getCharsUntil(' ');
    q = parseFloat(qString);

    // get p
    sin.ignore(' ');
    pString = sin.getCharsUntil(' ');
    p = parseFloat(pString);

    // ignore until semi-colon (or reach end)
    sin.ignore(' ');
    sin.ignore(';');

    qArray.push(q);
    pArray.push(p);
  }

  for (var i in qArray) {
    ctx.lineTo(canvas.width * qArray[i] / maxX,
      canvas.height - canvas.height * pArray[i] / maxY);
  }
  ctx.stroke();
} // graphSupply()

$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";

    graphSupply(supplyPoints);
  }
}); // document ready function