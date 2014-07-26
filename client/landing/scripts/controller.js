angular.module('landingApp', [])
.controller('LandingCtrl',
  function($scope, $http) {
  
  $scope.login = function() {
  	$http.get('//localhost:9000/api/user/twitter/').success(function (url) {
	    url = JSON.parse(url);
	    $scope.safeApply(function () {
	      console.log(url);
	    });
	  });
  };
});