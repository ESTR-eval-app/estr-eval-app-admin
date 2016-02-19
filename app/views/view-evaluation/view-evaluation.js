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
    var evalId = $routeParams.evalId;
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

    $scope.changeStatusBtnClick = function () {
      $("#statusChangeModal").modal("show");
      // TODO change status
    };

    $scope.saveChangesBtnClick = function () {
      // TODO check validation
      updateEvaluation();
    };

    $scope.updateStatusBtnClick = function () {
      if ($scope.evaluation.status == "Created") {
        if (!confirm("If you publish this evaluation, it can no longer be modified. Do you want to publish it?")) {
          return;
        }
      }
      $scope.evaluation.status = $scope.newStatus;

      $("#statusChangeModal").modal("hide");
      updateEvaluation();
    };

    function updateEvaluation() {
      //send update to server
      $http
        .put('http://localhost:3000/api/evaluations/' + evalId, $scope.evaluation, {
          headers: authService.getAPITokenHeader()
        }).then(success, fail);

      function success(response) {
        console.log(response);
        console.log('updated successfully');
        $('#updateSuccessAlert').show();
        $('#updateFailAlert').hide();

        setTimeout(function () {
          $('#updateSuccessAlert').fadeOut();
        }, 3000)

      }

      function fail(response) {
        console.log(response);
        console.log('update failed');
        $('#updateFailAlert').show();
        $('#updateSuccessAlert').hide();

        setTimeout(function () {
          $('#updateFailAlert').fadeOut();
        }, 3000)

      }

    }

  }]);