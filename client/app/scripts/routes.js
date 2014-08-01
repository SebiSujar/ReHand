'use strict';

angular.module('toolnetApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/App',
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
      });
  });