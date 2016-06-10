"use strict";

var offsetX = 10;
var offsetY = 10;
var maxX = 120;
var maxY = 1.50;

function graphAxes() {
  var canvas = document.getElementById("graph");
  var ctx = canvas.getContext("2d");
  ctx.moveTo(offsetX, canvas.height - offsetY);
  ctx.lineTo(canvas.width, canvas.height - offsetY);
  ctx.moveTo(offsetX, canvas.height - offsetY);
  ctx.lineTo(offsetX, 0);
  ctx.stroke();
}

function graphSupply(inputString) {
  var canvas = document.getElementById("graph");
  var ctx = canvas.getContext("2d");
  // ctx.fillStyle = "black";
  // ctx.fillRect(30, 30, 150, 75);

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

  // Draw the lines
  ctx.moveTo(canvas.width * qArray[0] / maxX + offsetX,
    canvas.height - canvas.height * pArray[0] / maxY + offsetY);
  for (var i in qArray) {
    ctx.lineTo(canvas.width * qArray[i] / maxX + offsetX,
      canvas.height - canvas.height * pArray[i] / maxY + offsetY);
  }
  ctx.stroke();
} // graphSupply()

$(document).ready(function() {
  if (!isUnitTesting()) {
    // Hardcoded data; eventually read from file
    var supplyPoints = "40 0.25 ; 50 0.30 ; 90 0.75 ; 110 1.35";
    var demandPoints = "40 1.25 ; 80 0.75 ; 110 0.25";

    graphAxes();
    graphSupply(supplyPoints);
    graphSupply(demandPoints);
  }
}); // document ready function