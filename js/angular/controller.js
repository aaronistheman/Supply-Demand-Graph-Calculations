"use strict";

// The module must have a name, or else an error occurs
var angularJS = angular.module("app", []).controller('ctrl', function($scope) {
  // The initializations (I'd rather they're here than scattered around
  // with a bunch of data-ng-init directives)
  // $scope.isClosed = false;
  // $scope.isPublic = false;
  $scope.isClosed = true;
  $scope.isPublic = true;
  $scope.taxed = "supply";
  $scope.subsidized = "supply";
  $scope.priceMechanism = "none";
  $scope.tradeFactor = "none";
}); // Angular JS controller