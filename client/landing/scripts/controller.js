angular.module('landingApp', [])
.controller('LandingCtrl',
  function($scope, $http, $window) {
  
  $scope.login = function() {
  	$http.get('/api/user/twitter/').success(function (url) {
      console.log("url");
      console.log(url);
      $window.location.href = url;
		});
  };
});