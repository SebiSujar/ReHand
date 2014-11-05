angular.module('landingApp', [])
.controller('LandingCtrl',
  function($scope, $http, $window) {
  
  $scope.toLogin = function() {
    $window.location.href = '/login';
  };
});