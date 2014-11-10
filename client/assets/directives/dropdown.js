angular.module('ReHand')
.directive('rhDropdown', function($rootScope) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			options: '=',
			onSelectMethod: '=',
			defaultOption: '=',
			clickedOption: '=',
			placeHolder: '@',
			hideSelected: '@'
		},
		template: '\
		<div class="default btn-group dropdown" ng-class="{pristine: clickedOption == placeHolder, open: dropdownOpen}" ng-click="toggleDropdown()">\
          <div class="btn-group lang-dropdown">\
            <div class="dropdown-button">\
              <span class="text-large">{{clickedOption}}</span>\
              <span class="caret"></span>\
            </div>\
            <ul class="dropdown-list" role="menu" >\
              <li ng-repeat="option in options"\
               ng-hide="hideSelected && option == clickedOption"\
               ng-click="itemClick(option, $event)" role="presentation">\
              	<span>{{option}}</span>\
              </li>\
            </ul>\
          </div>\
        </div>\
        ',
		controller: function($window, $scope) {
			$scope.clickedOption = $scope.defaultOption || $scope.placeHolder;

			function silenceEvent (event){
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			$window.onclick = function(event) {
				window.a = event;
	      	if ($(event.target).closest('.dropdown').length == 0) {
	            	$scope.$apply(function(){
									$scope.dropdownOpen = false;
	            	});
			    }
	      };

			$scope.toggleDropdown = function() {
				$scope.dropdownOpen = !$scope.dropdownOpen;
			}

			$scope.itemClick = function(option, event) {
				$()
				silenceEvent(event);
				$scope.dropdownOpen = false;
				$scope.clickedOption = option;
				if ($scope.onSelectMethod) {
					$scope.onSelectMethod(option);
				}
			};

			function update () {
				if (!$rootScope.user) {
					return;
				}
				if (!$scope.clickedOption) {
					$scope.clickedOption = $scope.defaultOption || $scope.placeHolder;
				}
				$scope.clickedOption = $rootScope.lang[$scope.clickedOption];
			};

			$scope.$watch('defaultOption', function(newValue, oldValue) {
				update();
			});

			$scope.$watch('options', function(newValue, oldValue) {
				update();
			});
		}
	}
});