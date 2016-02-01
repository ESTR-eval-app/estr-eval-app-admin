'use strict';

angular.module('myApp.evaluations', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/evaluations', {
    templateUrl: 'views/view_evaluations/view_evaluations.html',
    controller: 'EvaluationsController'
  });
}])

.controller('EvaluationsController', [function() {

}]);