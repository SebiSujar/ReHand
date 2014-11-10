'use strict';

angular.module('ReHand')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/App',
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
      });
  });