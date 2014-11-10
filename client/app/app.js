'use strict';

angular.module('ReHand', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider
    .otherwise('/');

  $locationProvider.html5Mode(true);
});