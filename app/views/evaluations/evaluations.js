'use strict';

angular.module('app.evaluations', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/evaluations', {
    templateUrl: 'views/evaluations/evaluations.html',
    controller: 'EvaluationsController'
  });
}])

.controller('EvaluationsController', ['$http', '$scope', '$location', 'authService', function($http, $scope, $location, authService) {

  $http
    .get("http://localhost:3000/api/evaluations", {
      headers : authService.getAPITokenHeader()
    }).then(evaluationsRetrieveSuccess, evaluationsRetrieveFailure);

  function evaluationsRetrieveSuccess(response) {
      console.log(response);
      $scope.evaluations = response.data;
      // TODO format date, highlight status colours
    }

  function evaluationsRetrieveFailure(response) {
    console.log(response);

    if (response.status == 404) {
      console.log('no evaluations found');
    }
    else {
      console.log('failed')
    }
  }

  $scope.viewEvaluation = function(id) {
    $location.path("/view-evaluation/" + id);
  }

}]);