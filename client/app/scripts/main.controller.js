angular.module('ReHand')
.controller('MainCtrl', function ($scope, $rootScope, $resource, $cookies, $routeParams, $http, $window, localStorageService) {
  
  //var backUrl = '//localhost:3000';
  var backUrl = '//rehand.org';

	$scope.logout = function() {
    if ($routeParams.path) { 
      $cookies.routePath = $routeParams.path;
    }
    localStorageService.remove('user');
    $cookies.JSESSIONID = '';
    return $window.location = '/';
  };
  
  function manageLogin(callback) {
    if ($scope.user) {
      $cookies.JSESSIONID = $scope.userCookie = $scope.user.sessionToken;
    } else {
      $scope.userCookie = $cookies.JSESSIONID;
    }

    if (!$scope.userCookie) {
      console.log("User have not cookie");
      $scope.logout();
    } else {
      // si solo tengo la cookie pido el usuario completo
      $scope.user = localStorageService.get('user');
      if(!$scope.user) {
        $http.get(backUrl + '/api/user/').success(function(user) {
          if(!user) {
            console.log("no user when attempting the get request");
            $scope.logout();
          }else{
            var parsedPatient = parsePatients([user])[0];
            $scope.user = parsedPatient;
            consle.log(parsedPatient);
            localStorageService.set('user', $scope.user);
            return callback();
          }
        }).error(function() {
          console.log("error on request");
          $scope.logout();
        });
      } else {
        if (!$scope.user.data) {
          $scope.user = parsePatients([$scope.user])[0];
        }
        localStorageService.set('user', $scope.user);
        return callback();
      }
    }
  };

  $scope.expandChart = function(id, data){
    if (id == "big-chart-container") {
      $scope.darkActive = true;
      $scope.modals.bigChart = true;
    }
    setTimeout(function() {
      $('#' + id).highcharts({
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
            data: data.closedHands
        }, {
            name: 'Flexion de codo',
            data: data.elbowFlexions
        }, {
            name: 'Giro izquierda',
            data: data.rotationsLeft
        }, {
            name: 'Giro derecha',
            data: data.rotationsRight
        }]
      }); 
    }, 100);
  };

  $scope.closeBigChart = function() {
    $scope.darkActive = false;
    $scope.modals.bigChart = false;
  };

  $scope.toRegisterPatient = function() {
    $scope.darkActive = true;
    $scope.modals.registerPatient = true;
  };

  $scope.closeRegisterPatient = function() {
    $scope.darkActive = false;
    $scope.modals.registerPatient = false;
  };

  $scope.registerPatient = function() {
    var uri = backUrl + '/user';
    $scope.newPatient.doctors = [$scope.user.email];
    $scope.newPatient.error = false;
    $scope.newPatient.errors = {};
    if (!$scope.newPatient.name || !$scope.newPatient.email || !$scope.newPatient.password || !$scope.newPatient.confirm_password || !$scope.newPatient.initialLevel || $scope.newPatient.initialLevel == "Nivel Inicial" || !$scope.newPatient.gender || $scope.newPatient.gender == "Sexo") {
      $scope.newPatient.error = true;
      return $scope.newPatient.errors.user_incomplete = true;
    }
    if ($scope.newPatient.password != $scope.newPatient.confirm_password) {
      $scope.newPatient.error = true;
      return $scope.newPatient.errors.confirm_password = true;
    }
    $scope.newPatient.sessionToken = $scope.user.sessionToken;
    $http.post(uri, $scope.newPatient).success(function(patient) {
      if (patient._id) {
        $scope.newPatient = {
          initialLevel: 'Nivel Inicial',
          gender: 'Sexo'
        };
        var parsedPatient = parsePatients([patient])[0];
        $scope.patients.push(parsedPatient);
        $scope.closeRegisterPatient();
      }
    }).error(function(err) {
      $scope.newPatient.error = true;
      return $scope.newPatient.errors[err] = true;
    });
  };

  $scope.toDownloadGame = function() {
    $scope.tabs.selected = 'downloadGame'
  }

  $scope.toMyProfile = function() {
    $scope.tabs.selected = 'profile';
    $scope.toPatient($scope.user);    
  }

  $scope.toPatientsList = function(){
    if ($scope.tabs.selected == 'profile') {
      $scope.closeShowPatient();
    }
    $scope.tabs.selected = 'pacientes';
  }

  $scope.toPatient = function(patient) {
    var uri = backUrl + '/users/patients';
    console.log("selecting " + patient.name);
    if (!patient.daysUsed) {
      patient.daysUsed = (new Date().getTime() - $scope.user.creation) / 1000 / 60 / 60 / 24;
    }
    $scope.activePatient = angular.copy(patient);
    $scope.activePatient.errors = {};
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

  $scope.openEditPatient = function() {
    $scope.activePatient.confirm_password = angular.copy($scope.activePatient.password); 
    setTimeout(function() {
      window.postMessage("updateDropdowns", 'http:' + backUrl);
    }, 100);
    $scope.darkActive = true;
    $scope.modals.editPatient = true;
  };

  $scope.closeEditPatient = function() {
    $scope.darkActive = false;
    $scope.modals.editPatient = false;
  };

  $scope.editPatient = function () {
    var uri = backUrl + '/user';
    $scope.activePatient.doctors = [$scope.user.email];
    $scope.activePatient.error = false;
    $scope.activePatient.errors = {};
    if (!$scope.activePatient.name || !$scope.activePatient.email || !$scope.activePatient.password || !$scope.activePatient.confirm_password || !$scope.activePatient.initialLevel || $scope.activePatient.initialLevel == "Nivel Inicial" || !$scope.activePatient.gender || $scope.activePatient.gender == "Sexo") {
      $scope.activePatient.error = true;
      return $scope.activePatient.errors.user_incomplete = true;
    }
    if ($scope.activePatient.password != $scope.activePatient.confirm_password) {
      $scope.activePatient.error = true;
      return $scope.activePatient.errors.confirm_password = true;
    }
    $scope.activePatient.sessionToken = $scope.user.sessionToken;
    $http.put(uri, $scope.activePatient).success(function(patient) {
      if (patient._id) {
        patient.daysUsed = (new Date().getTime() - $scope.user.creation) / 1000 / 60 / 60 / 24;
        $scope.patients.forEach(function(scopePatient, i){
          if (scopePatient.email == patient.email) {
            $scope.patients[i].name = patient.name;
            $scope.patients[i].email = patient.email;
            $scope.patients[i].password = patient.password;
            $scope.patients[i].gender = patient.gender;
            $scope.patients[i].initialLevel = patient.initialLevel;
            $scope.patients[i].errors = {};
          }
        });
        $scope.closeEditPatient();
      }
    }).error(function(err) {
      if (err == "bad_cookie" || err == "no_cookie") return $scope.logout();
      $scope.activePatient.error = true;
      return $scope.activePatient.errors[err] = true;
    });
  };

  $scope.deletePatient = function(status) {
    if (!status) {
      $scope.darkActive = true;
      $scope.modals.sureDeletePatient = true;
    } else {
      var uri = backUrl + '/user/' + $scope.activePatient.email;
      $http.delete(uri).success(function(deletedEmail) {
        $scope.patients.forEach(function(patient, index){
          $scope.closeShowPatient();
          if (patient.email == deletedEmail) {
            $scope.patients.splice(index, 1)
          }
          $scope.closeDeletePatient();
        });
      }).error(function(err) {
        if (err == "bad_cookie" || err == "no_cookie") return $scope.logout();
        $scope.activePatient.error = true;
        return $scope.activePatient.errors[err] = true;
      });
    }
  };

  $scope.closeDeletePatient = function() {
    $scope.darkActive = false;
    $scope.modals.sureDeletePatient = false;
  };  

  $scope.closeShowPatient = function() {
    delete $scope.activePatient;
  };

  function countArrayProperty(array, property) {
    var counter = 0;
    array.forEach(function(one) {
      counter += one[property].length;
    });
    return counter;
  }

  function parsePatients(patients) {
    patients.forEach(function(patient) {
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
      patient.games.forEach(function(game) {
        patient.data.games.closedHands.push(game.closedHands);
        patient.data.games.elbowFlexions.push(game.elbowFlexions);
        patient.data.games.percentageInTrack.push(game.percentageInTrack);
        patient.data.games.rotationsLeft.push(game.rotationsLeft);
        patient.data.games.rotationsRight.push(game.rotationsRight);
      });
      patient.performanceTest.forEach(function(game) {
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
      $scope.allGames = countArrayProperty(patients, 'games');
      $scope.patients = parsePatients(patients);
    }).error(function() {
        return $scope.logout();
    });
  }

  /*
  *
	* Initialize Variables
	*
  */

  $scope.genders = ["Hombre", "Mujer"];
  $scope.gameLevels = ["1", "2", "3", "4", "5"];
  $scope.newPatient = {};
  $scope.modals = {};
  $scope.tabs = {
    selected: 'pacientes'
  };

  /*
  *
  * Begining functions
  *
  */

  manageLogin(function() {
    if ($scope.user.job == 'doctor') {
      getPatients();
    } else {
      $scope.tabs = { selected: 'profile' };
      $scope.toPatient($scope.user);
    }
  });
});
