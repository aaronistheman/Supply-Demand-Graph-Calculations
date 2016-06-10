"use strict";

// The module must have a name, or else an error occurs
var angularJS = angular.module("app", []).controller('ctrl', function($scope) {
  // The initializations (I'd rather they're here than scattered around
  // with a bunch of data-ng-init directives)
  $scope.isClosed = true;
  $scope.isPublic = false;
  $scope.taxed = "supply";
  $scope.subsidized = "supply";
  $scope.priceMechanism = "none";
  $scope.tradeFactor = "none";
}); // Angular JS controller

function graphSupply(supplyPoints) {
  var canvas = document.getElementById("graph");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(30, 30, 150, 75);
} // graphSupply()

$(document).ready(function() {
  // Hardcoded data; eventually read from file
  var supplyPoints = "40 0.25 ; 90 0.75 ; 110 1.35";

  graphSupply(supplyPoints);
}); // document ready function