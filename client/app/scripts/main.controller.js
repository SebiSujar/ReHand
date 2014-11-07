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
        $scope.newPatient = {};
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
    setTimeout(function() {
      $('#chart-container').highcharts({
          title: {
              text: ''
          },
          xAxis: {
              labels: {
                  formatter: function() {
                      return this.value + ' veces';
                  }
              }
          },
          yAxis: {
              title: {
                  text: 'Repeticiones'
              },
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
          },
          tooltip: {
              valueSuffix: ' repeticiones'
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
              name: 'Cierres de mano',
              data: patient.data.games.closedHands
          }, {
              name: 'Flexion de codo',
              data: patient.data.games.elbowFlexions
          }, {
              name: 'Giro izquierda',
              data: patient.data.games.rotationsLeft
          }, {
              name: 'Giro derecha',
              data: patient.data.games.rotationsRight
          }]
      }); 
      $('#chart-container2').highcharts({
          title: {
              text: ''
          },
          xAxis: {
              labels: {
                  formatter: function() {
                      return this.value + ' veces';
                  }
              }
          },
          yAxis: {
              title: {
                  text: 'Repeticiones'
              },
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
          },
          tooltip: {
              valueSuffix: ' repeticiones'
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
              name: 'Cierres de mano',
              data: patient.data.tests.closedHands
          }, {
              name: 'Flexion de codo',
              data: patient.data.tests.elbowFlexions
          }, {
              name: 'Giro izquierda',
              data: patient.data.tests.rotationsLeft
          }, {
              name: 'Giro derecha',
              data: patient.data.tests.rotationsRight
          }]
      });
    }, 200);
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

  function parsePatients(patients) {
    patients.forEach(function(patient){
      patient.data = {
        games: {
          closedHands: [0],
          elbowFlexions: [0],
          percentageInTrack: [0],
          rotationsLeft: [0],
          rotationsRight: [0]
        },
        tests: {
          closedHands: [0],
          elbowFlexions: [0],
          percentageInTrack: [0],
          rotationsLeft: [0],
          rotationsRight: [0]
        }
      };
      patient.games.forEach(function(game){
        patient.data.games.closedHands.push(game.closedHands);
        patient.data.games.elbowFlexions.push(game.elbowFlexions);
        patient.data.games.percentageInTrack.push(game.percentageInTrack);
        patient.data.games.rotationsLeft.push(game.rotationsLeft);
        patient.data.games.rotationsRight.push(game.rotationsRight);
      });
      patient.performanceTest.forEach(function(game){
        patient.data.tests.closedHands.push(game.closedHands);
        patient.data.tests.elbowFlexions.push(game.elbowFlexions);
        patient.data.tests.percentageInTrack.push(game.percentageInTrack);
        patient.data.tests.rotationsLeft.push(game.rotationsLeft);
        patient.data.tests.rotationsRight.push(game.rotationsRight);
      });
    });
    return patients;
  }

  function getPatients () {
    var uri = backUrl + '/users/patients';
    $http.get(uri).success(function(patients) {
      console.log("java patients");
      console.log(patients);
      $scope.allGames = countArrayProperty(patients, 'games');
      $scope.patients = parsePatients(patients);
      console.log(patients);
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
