'use strict';

angular.module('app.view-evaluation', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view-evaluation/:evalId', {
      templateUrl: 'views/view-evaluation/view-evaluation.html',
      controller: 'ViewEvaluationController'
    });
  }])

  .controller('ViewEvaluationController', ['$routeParams', '$scope', '$http', 'authService', function ($routeParams, $scope, $http, authService) {

    console.log("hello");
    var evalId = $routeParams.evalId;;
    $http
      .get('http://localhost:3000/api/evaluations/' + evalId, {
       headers: authService.getAPITokenHeader()
      }).then(success, fail);

      function success(response) {
        $scope.evaluation = response.data[0];
        $scope.evaluation.resultsAvailableDate = new Date($scope.evaluation.resultsAvailableDate);
        console.log(response);
        console.log('retrieved successfully');
      }

      function fail(response) {
        console.log(response.data);
        console.log('retrieved fail');
      }

    function changeStatusBtnClick() {
      // TODO change status
    }

    function saveChangesBtnClick() {

    }

  }]);