// The module must have a name, or else an error occurs
var angularJS = angular.module("app", []).controller('ctrl', function($scope) {
  $scope.isClosed = true;
});

$(document).ready(function() {

}); // document ready function