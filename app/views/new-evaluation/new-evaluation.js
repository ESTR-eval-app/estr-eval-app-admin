'use strict';

angular.module('app.new-evaluation', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/new-evaluation', {
      templateUrl: 'views/new-evaluation/new-evaluation.html',
      controller: 'NewEvaluationController'
    });
  }])

  .controller('NewEvaluationController', [function() {

  }]);