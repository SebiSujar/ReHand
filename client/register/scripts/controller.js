angular.module('registerApp', ['LocalStorageModule'])
.controller('RegisterController',
  function($scope, $http, $window, localStorageService) {
  
  var backUrl = '//localhost:3000';
  //var backUrl = '//romansuarez.com.ar';

  $scope.user = {};
  $scope.errors = {};

  $scope.register = function(event) {
    $scope.registerError = false;
    $scope.errors = {};
    if (!$scope.user.name || !$scope.user.email || !$scope.user.password || !$scope.user.confirm_password || !$scope.user.secret) {
      $scope.registerError = true;
      return $scope.errors.user_incomplete = true;
    }
    if ($scope.user.password != $scope.user.confirm_password) {
      $scope.registerError = true;
      return $scope.errors.confirm_password = true;
    }
    $http.post('/api/register', $scope.user).success(function (user) {
      localStorageService.set('user', user);
      $window.location.href = '/App';
    }).error(function(err) {
      $scope.registerError = true;
      return $scope.errors[err] = true;
    });
  };
});