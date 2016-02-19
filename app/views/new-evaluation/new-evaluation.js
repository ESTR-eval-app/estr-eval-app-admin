'use strict';

// TODO validate form

angular.module('app.new-evaluation', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/new-evaluation', {
      templateUrl: 'views/new-evaluation/new-evaluation.html',
      controller: 'NewEvaluationController'
    });
  }])

  .controller('NewEvaluationController', ['$scope', '$http', 'authService', function ($scope, $http, authService) {

    $scope.newEvaluationSaveClick = function () {
      console.log($scope.evaluation);
      $scope.evaluation.createdBy = authService.getTokenUser().id;
      $scope.evaluation.questions = {};

      $http.post('http://localhost:3000/api/evaluations', $scope.evaluation, {
        headers: authService.getAPITokenHeader()
      }).then(success, fail);

      function success(response) {
        console.log(response);
        console.log('added successfully');

        // TODO confirm creation and return to evaluations
      }

      function fail(response) {
        console.log(response.data);
        console.log('adding failed');
        // TODO notify of failure
      }
    }

  }]);
