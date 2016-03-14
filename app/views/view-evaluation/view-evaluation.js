'use strict';

angular.module('app.view-evaluation', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view-evaluation/:evalId', {
      templateUrl: 'views/view-evaluation/view-evaluation.html',
      controller: 'ViewEvaluationController'
    });
  }])

  .controller('ViewEvaluationController', ['$routeParams', '$location', '$scope', '$http', 'authService', 'envService', 'fileUpload', function ($routeParams, $location, $scope, $http, authService, envService, fileUpload) {

    var evalId = $routeParams.evalId;
    getEvaluation();

    function getEvaluation() {
      $http
        .get('http:' + envService.read('apiUrl') + '/evaluations/' + evalId, {
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
    }

    function updateEvaluation() {

      var date = new Date($scope.evaluation.resultsAvailableDate);
      $scope.evaluation.resultsAvailableDate = date.getTime();

      //send update to server
      $http
        .put('http:' + envService.read('apiUrl') + '/evaluations/' + evalId, $scope.evaluation, {
          headers: authService.getAPITokenHeader()
        }).then(success, fail);

      function success(response) {
        console.log(response);
        console.log('updated successfully');
        showUpdateSuccessMessage();

      }

      function fail(response) {
        console.log(response);
        console.log('update failed');
        showUpdateFailMessage();

      }

    }

    function showUpdateFailMessage() {
      $('#updateFailAlert').show();
      $('#updateSuccessAlert').hide();

      setTimeout(function () {
        $('#updateFailAlert').fadeOut();
      }, 3000)
    }

    function showUpdateSuccessMessage() {
      $('#updateSuccessAlert').show();
      $('#updateFailAlert').hide();

      setTimeout(function () {
        $('#updateSuccessAlert').fadeOut();
      }, 3000)
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
        .delete('http:' + envService.read('apiUrl') + '/evaluations/' + $scope.evaluation.id, {
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


    // TODO clear upload chosen for new questions
    $scope.addQuestionBtnClick = function () {
      if (!$scope.evaluation.questions.length) {
        $scope.evaluation.questions = [];
      }
      $scope.editQuestion = {
        type: "Faces"
      };

      $("#questionDetailModal").modal("show");
    };

    // TODO changing question in modal incorrectly updates before save changes clicked

    $scope.editQuestionBtnClick = function (index) {
      $scope.editQuestion = $scope.evaluation.questions[index];
      $scope.editQuestion.index = index;
      $("#questionDetailModal").modal("show");
    };

    $scope.deleteQuestionBtnClick = function (index) {

      if (!confirm("Are you sure you want to delete this question?")) {
        return;
      }

      console.log($scope.evaluation.questions);
      console.log("remove at " + index);

      $scope.evaluation.questions.splice(index, 1);

      console.log($scope.evaluation.questions);

      updateEvaluation();
    };

    $scope.saveQuestionBtnClick = function () {
      // if an audio file has been uploaded, send it
      if (!$scope.audioFile) {
        saveQuestion();
        return;
      }
      var file = $scope.audioFile;
      console.log('file is ');
      console.dir(file);
      fileUpload.uploadFileToUrl(file, $scope.evaluation.id,
        $scope.editQuestion.index || $scope.evaluation.questions.length,
        onAudioSaveSuccess, onAudioSaveFail);
    };

    function onAudioSaveSuccess(response) {
      console.log(response);
      if (response.message == "stored successfully") {
        console.log(response.message);
        console.log($scope.editQuestion);
        $scope.editQuestion.audioPath = response.uri;
        saveQuestion();
      }
      else {
        console.error(response.message);
        showUpdateFailMessage();
      }
    }

    function onAudioSaveFail(error) {
      console.error(error);
      showUpdateFailMessage()
    }

    function saveQuestion() {
      if ($scope.editQuestion.index) {
        // has an index, is an edit
        var i = $scope.editQuestion.index;
        delete $scope.editQuestion.index;
        console.log($scope.evaluation.questions);
        $scope.evaluation.questions.splice(i, $scope.editQuestion);
        console.log($scope.evaluation.questions);
      }
      else {
        // new, add to end
        $scope.evaluation.questions.push($scope.editQuestion);

      }

      $("#questionDetailModal").modal("hide");

      updateEvaluation();
      getEvaluation();
    }

    $scope.copyEvaluationBtnClick = function () {
      var evaluation = $scope.evaluation;
      delete evaluation.id;
      delete evaluation.resultsAvailableDate;
      delete evaluation.status;

      window.localStorage['copyEvaluation'] = JSON.stringify($scope.evaluation);
      $("#statusChangeModal").modal("hide");
      $location.path("/new-evaluation");
    };

    $scope.viewResultsBtnClick = function (id) {
      $("#statusChangeModal").modal("hide");
      $location.path("/view-results/" + id);

    };


    $scope.playAudio = function (url) {
      console.log($scope.editQuestion);
      console.log('playing ' + url);
      new Audio(url).play();
    }


  }]);