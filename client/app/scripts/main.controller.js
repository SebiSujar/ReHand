angular.module('toolnetApp')
.controller('MainCtrl', function ($scope, $rootScope, $resource, $cookies, $routeParams, $http, $window, localStorageService) {
  
  //var backUrl = '//localhost:3000';
  var backUrl = '//romansuarez.com.ar';

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
  
  function manageLogin(callback){
    if ($scope.user){
      $cookies.JSESSIONID = $scope.userCookie = $scope.user.sessionToken;
    }else{
      $scope.userCookie = $cookies.JSESSIONID;
    }

    if (!$scope.userCookie){
      console.log("User have not cookie");
      redirectToLogin();
    }else{
      // si solo tengo la cookie pido el usuario completo
      $scope.user = localStorageService.get('user');
      if(!$scope.user){
        $http.get(backUrl + '/api/user/').success(function(user) {
          if(!user){
            console.log("no user when attempting the get request");
            redirectToLogin();
          }else{
            console.log(user);
            $scope.user = user;
            localStorageService.set('user', $scope.user);
            return callback();
          }
        }).error(function() {
          console.log("error on request");
          redirectToLogin();
        });
      }else{
        localStorageService.set('user', $scope.user);
        return callback();
      }
    }
  };

  $scope.registerPatient = function() {
    var uri = backUrl + '/user';
    console.log("saving user");
    console.log($scope.newPatient);
    $scope.newPatient.sessionToken = $scope.user.sessionToken;
    $http.post(uri, $scope.newPatient).success(function(patient) {
      if (patient._id) {
        $scope.patients.push(patient);
      }
    }).error(function() {
      console.log("error on request");
      redirectToLogin();
    });
  };

  $scope.toPatient = function(patient) {
    var uri = backUrl + '/users/patients';
    console.log("selecting " + patient.name);
    if (!patient.daysUsed) {
      patient.daysUsed = (new Date().getTime() - $scope.user.creation) / 1000 / 60 / 60 / 24;
    }
    $scope.activePatient = patient;
  };

  $scope.closeShowPatient = function(){
    delete $scope.activePatient;
  };

  function countArrayProperty(array, property) {
    var counter = 0;
    array.forEach(function(one){
      counter += one[property].length;
    });
    return counter;
  }

  function getPatients () {
    var uri = backUrl + '/users/patients';
    $http.get(uri).success(function(patients) {
      $scope.allGames = countArrayProperty(patients, 'games');
      $scope.patients = patients;
    }).error(function() {
        return redirectToLogin();
    });
  }

  /*
  *
	* Initialize Variables
	*
  */

  $scope.newPatient = {};
  $scope.tabs = {
    selected: 'pacientes'
  };

  /*
  *
  * Begining functions
  *
  */

  manageLogin(function(){
    getPatients();
  });
});
