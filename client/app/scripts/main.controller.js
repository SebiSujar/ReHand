angular.module('toolnetApp')
.controller('MainCtrl', function ($scope, $rootScope, $cookies, $routeParams, $http, $window, localStorageService) {

	var redirectToLogin = function(){
    console.log("redirectToLogin");
    /*
    if($routeParams.path){ 
      $cookies.routePath = $routeParams.path;
    }

    localStorageService.remove('user');
    $cookies.JSESSIONID = '';
    return $window.location.href = '/';
    */
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
      if(!$rootScope.user || !$rootScope.user.fromLanding){
        $http.get('//localhost:9000/api/user/').success(function(user) {
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
      }else{
        $rootScope.user.fromLanding = false;
        localStorageService.set('user', $rootScope.user);
        $rootScope.user.fromLanding = true;
      }
    }
  }

  /*
  *
	* Initialize Variables
	*
  */


  /*
  *
  * Begining functions
  *
  */

  manageLogin();
});
