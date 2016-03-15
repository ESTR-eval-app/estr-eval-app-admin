'use strict';

// TODO validate form

angular.module('app.new-evaluation', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/new-evaluation', {
      templateUrl: 'views/new-evaluation/new-evaluation.html',
      controller: 'NewEvaluationController'
    });
  }])

  .controller('NewEvaluationController', ['$scope', '$location', '$http', 'authService', 'envService', function ($scope, $location, $http, authService, envService) {

    if (window.localStorage['copyEvaluation']) {
      //copy of evaluation
      $scope.evaluation = JSON.parse(window.localStorage['copyEvaluation']);
      window.localStorage.removeItem('copyEvaluation');
      $scope.isCopy = true;
      $scope.evaluation.name = "Copy of " + $scope.evaluation.name;
    }

    else {
      // new empty evaluation
      $scope.evaluation = {
        isAnonymous: true,
        questions: {}
      };
      $scope.isCopy = false;
    }

    $scope.newEvaluationSaveClick = function () {
      console.log($scope.evaluation);

      var evalToSave = angular.copy($scope.evaluation);
      evalToSave.createdBy = authService.getTokenUser().id;
      evalToSave.resultsAvailableDate = evalToSave.resultsAvailableDate.getTime();

      console.log('saving new evaluation...');
      console.log(evalToSave);

      $http.post('http:' + envService.read('apiUrl') + '/evaluations', evalToSave, {
        headers: authService.getAPITokenHeader()
      }).then(success, fail);

      function success(response) {
        console.log(response);
        console.log('added successfully');
        $location.path("/view-evaluation/" + response.data.id);
      }

      function fail(response) {
        console.log(response.data);
        console.log('adding failed');
      }
    }

  }]);
