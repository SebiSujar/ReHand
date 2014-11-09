angular.module('loginApp', ['LocalStorageModule'])
.controller('LoginController',
  function($scope, $http, $window, localStorageService) {
  
  var backUrl = '//localhost:3000';
  //var backUrl = '//romansuarez.com.ar';

  $scope.user = {};
  $scope.errors = {};

  $scope.register = function(event) {
    console.log("register");
    $scope.registerError = false;
    if ($scope.user.password != $scope.user.confirm_password) return $scope.errors.confirm_password = true; 
    $http.post('/api/user', $scope.user).success(function (user) {
      localStorageService.set('user', user);
      $window.location.href = '/App';
    }).error(function() {
      console.log("error on request");
      $scope.registerError = true;
    });
  };
});