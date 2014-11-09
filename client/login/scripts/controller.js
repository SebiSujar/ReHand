angular.module('loginApp', ['LocalStorageModule'])
.controller('LoginController',
  function($scope, $http, $window, localStorageService) {
  
  var backUrl = '//localhost:3000';
  //var backUrl = '//romansuarez.com.ar';

  $scope.user = {};

  $scope.login = function(event) {
  	console.log($scope.user);
    $scope.loginError = false;
    $http.post('/api/user', $scope.user).success(function (user) {
      localStorageService.set('user', user);
      $window.location.href = '/App';
    }).error(function() {
      console.log("error on request");
      $scope.loginError = true;
    });
  };

  function manageLogin(){
    if ($rootScope.user){
      $cookies.JSESSIONID = $scope.userCookie = $rootScope.user.sessionToken;
    }else{
      $scope.userCookie = $cookies.JSESSIONID;
    }

    if (!$scope.userCookie){
      console.log("User have not cookie");
      redirectToLogin();
    }else{
      // si solo tengo la cookie pido el usuario completo
      $rootScope.user = localStorageService.get('user');
      if(!$rootScope.user){
        $http.get(backUrl + '/api/user/').success(function(user) {
          if(!user){
            console.log("no user when attempting the get request");
            redirectToLogin();
          }else{
            console.log(user);
            $rootScope.user = user;
            localStorageService.set('user', $rootScope.user);
          }
        }).error(function() {
          console.log("error on request");
          redirectToLogin();
       });
      }
    }
  }
});