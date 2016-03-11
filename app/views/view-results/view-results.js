'use strict';

angular.module('app.view-results', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view-results/:evalId', {
      templateUrl: 'views/view-results/view-results.html',
      controller: 'ViewResultsController'
    });
  }])

  .controller('ViewResultsController', ['$routeParams', '$location', '$scope', '$http', 'authService', 'envService', function ($routeParams, $location, $scope, $http, authService, envService) {

    $scope.chartOptions = {
      axisX: {
        onlyInteger: true
      },
      horizontalBars: true
    };


    // TODO handle page access if evaluation status isn't finished

    var evalId = $routeParams.evalId;
    getEvaluation(evalId);
    getResultsForEvaluation(evalId);

    function getEvaluation(id) {
      $http
        .get('http:' + envService.read('apiUrl') + '/evaluations/' + id, {
          headers: authService.getAPITokenHeader()
        }).then(success, fail);

      function success(response) {
        console.log('retrieved eval');
        $scope.evaluation = response.data[0];
      }

      function fail(response) {
        console.error(response.data);
      }

    }

    function getResultsForEvaluation(id) {
      $http
        .get('http:' + envService.read('apiUrl') + '/evaluations/' + id + '/results', {
          headers: authService.getAPITokenHeader()
        }).then(success, fail);

      function success(response) {
        $scope.results = response.data;
        $scope.results.responsesStartDate = getAndFormatDateTime($scope.results.responsesStartDate);
        $scope.results.responsesEndDate = getAndFormatDateTime($scope.results.responsesEndDate);

        // set endpoint of chart scale
        $scope.chartOptions.high = $scope.results.numResponses;
        getResponseDistributions();
      }

      function fail(response) {
        console.error(response.data);
      }

    }

    //// TODO move to another module where can be shared
    function getAndFormatDateTime(date) {
      var result = new Date(date);
      result = result.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
      });
      return result;
    }

    var chartLabels = ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"];
    // todo if NA or DK resps allowed, append to labels array
    // TODO move this in case needs to be changed


    // TODO move to server
    function getResponseDistributions() {
      $scope.chartsData = [];
      $scope.results.responseCounts.forEach(function (value, index, responses) {
        var respDistribution = [0, 0, 0, 0];
        Object.keys(value.responses).forEach(function (key) {
          respDistribution[key - 1] = value.responses[key];
        });
        var data = {
          labels: chartLabels,
          series: [respDistribution]
        };
        $scope.chartsData.push(data);
      })

    }

  }]);