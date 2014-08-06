var app = angular.module('app',[]);

app.controller('chartCtrl',[$scope,function scope($scope){

	$scope.percent = %65;

	$scope.options = {
	  animate:{
	    duration:0,
	    enabled:false
	  },
	  barColor:'#2C3E50',
	  scaleColor:false,
	  lineWidth:20,
	  lineCap:'circle'
	  };

	$scope.update = function(){
	  //$scope.number = Math.floor(100*Math.random())
	  $scope.number = 90
	  console.log($scope.number)
	};
	    
	$scope.reset = function(){
	  $scope.number = 10;
	  console.log($scope.number);
	};

}]);

app.directive('knob', function() {
	return {
	  restrict: 'A',
	  link: function(scope, element, attrs) {
	                
	  $(element).knob().val(scope.number); 
	  console.log(attrs);
	}
	};
});