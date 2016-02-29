'use strict';

angular.module('app.view-results', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view-results/:evalId', {
      templateUrl: 'views/view-results/view-results.html',
      controller: 'ViewResultsController'
    });
  }])

  .controller('ViewResultsController', ['$routeParams', '$location', '$scope', '$http', 'authService', 'envService', function ($routeParams, $location, $scope, $http, authService, envService) {


    var evalId = $routeParams.evalId;
    $http
      .get('http:' + envService.read('apiUrl') + '/evaluations/' + evalId, {
        headers: authService.getAPITokenHeader()
      }).then(success, fail);

    function success(response) {
      $scope.evaluation = response.data[0];
      $scope.evaluation.resultsAvailableDate = new Date($scope.evaluation.resultsAvailableDate);
    }

    function fail(response) {
      console.error(response.data);
    }


  }]);