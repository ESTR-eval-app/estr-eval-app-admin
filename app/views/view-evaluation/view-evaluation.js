'use strict';

angular.module('app.view-evaluation', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view-evaluation/:evalId', {
      templateUrl: 'views/view-evaluation/view-evaluation.html',
      controller: 'ViewEvaluationController'
    });
  }])

  .controller('ViewEvaluationController', ['$routeParams', '$location', '$scope', '$http', 'authService', function ($routeParams, $location, $scope, $http, authService) {

    $scope.questionsModified = false;

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
    };

    $scope.saveEvalOptionsBtnClick = function () {
      // TODO check validation
      updateEvaluation();
    };

    $scope.deleteEvaluationBtnClick = function () {
      if (!confirm("Are you sure you want to delete this evaluation? This cannot be undone.")) {
        return;
      }
      $http
        .delete('http://localhost:3000/api/evaluations/' + $scope.evaluation.id, {
          headers: authService.getAPITokenHeader()
        }).then(success, fail);

      function success(response) {
        console.log('deleted successfully');
        $location.path('/evaluations');
      }

      function fail(response) {
        console.log(response);
        console.log('delete failed');
      }
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
        $('#questionsModifiedAlert').hide();


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

    $scope.addQuestionBtnClick = function () {
      if (!$scope.evaluation.questions.length) {
        $scope.evaluation.questions = [];
      }
      $scope.editQuestion = {
        type: "Faces"
      };

      $("#questionDetailModal").modal("show");
    };

    $scope.completeQuestionModifyBtnClick = function () {
      $scope.evaluation.questions.push($scope.editQuestion);
      // TODO get path of uploaded file and add to obj
      $("#questionDetailModal").modal("hide");
      $("#questionsModifiedAlert").show();
      $scope.questionsModified = true;
    };

    $scope.editQuestionBtnClick = function (index) {
      $scope.editQuestion = $scope.evaluation.questions[index];
      $("#questionDetailModal").modal("show");
    };

    $scope.deleteQuestionBtnClick = function (index) {
      $('#questionsModifiedAlert').show();
      $scope.questionsModified = true;

      if (!confirm("Are you sure you want to delete this question?")) {
        return;
      }

      console.log($scope.evaluation.questions);
      console.log("remove at " + index);

      $scope.evaluation.questions.splice(index, 1);

      console.log($scope.evaluation.questions);
    };

    $scope.saveQuestionsBtnClick = function () {
      updateEvaluation();
    }

  }]);