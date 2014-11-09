angular.module('registerApp', ['LocalStorageModule'])
.controller('RegisterController',
  function($scope, $http, $window, localStorageService) {
  
  var backUrl = '//localhost:3000';
  //var backUrl = '//romansuarez.com.ar';

  $scope.user = {};
  $scope.errors = {};

  $scope.register = function(event) {
    $scope.registerError = false;
    if ($scope.user.password != $scope.user.confirm_password) return $scope.errors.confirm_password = true;
    $http.post('/api/register', $scope.user).success(function (user) {
      localStorageService.set('user', user);
      $window.location.href = '/App';
    }).error(function(error) {
      console.log("error");
      console.log(error);
      $scope.registerError = true;
    });
  };
});