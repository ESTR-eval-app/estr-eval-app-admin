'use strict';

angular.module('app.evaluations', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/evaluations', {
    templateUrl: 'views/evaluations/evaluations.html',
    controller: 'EvaluationsController'
  });
}])

.controller('EvaluationsController', function($http, $scope) {

  $http
    .get("http://localhost:3000/api/evaluations/") // TODO fix url for production
    .then(function success(response) {
      $scope.evaluations = response.data;
    }, function failure(response) {
      console.log(response);
      console.log('failed')
    });

  $scope.viewEvaluation = function(id) {
    console.log('view evaluation ' + id);
    // TODO go to evaluation edit
  }

});