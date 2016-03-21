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

        // prevent page access if results aren't available
        if ($scope.evaluation.status != "Finished") {
          $location.path("/view-evaluation");
        }

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
        getChartData();
        // console.log($scope.results.qualitativeResponses)
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

    $scope.chartData = [{
      labels: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
      series: ['Series'],
      data: [
        [65, 59, 80, 81]
      ]
    }
    ];
    // todo if NA or DK resps allowed, append to labels array
    // TODO move this in case needs to be changed


    // TODO move to server
    function getChartData() {
      $scope.chartData = [];
      $scope.results.responseCounts.forEach(function (value, index, responses) {
        var chart = {
          series: ["Series"],
          labels: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
          data: []
        };
        var respDistribution = [0, 0, 0, 0];
        //console.log(chart)
        Object.keys(value.responses).forEach(function (key) {
          respDistribution[key - 1] = value.responses[key];
        });
        respDistribution = respDistribution.slice(0, 4); // TODO only dealing with 1-4 scale items, deal with string keys?
        chart.data[0] = respDistribution;
        $scope.chartData.push(chart);
      });
      console.log($scope.chartData)
    }

    $scope.downloadGraphsBtnClick = function () {
      var pdf = new jsPDF();
      var options = {
        width: 170,
        specialElementHandlers: {
          'canvas': function (element, renderer) {
            console.log(element)
          }
        }
      };
      var html = $('#reportHead').prop('outerHTML');
      html += "<br><br><br>";
      html += "<h2>Quantitative Response Distibution Report</h2>";
      html += "<p>Data collected and report generated with Eval&nbsp;n</p>";
      console.log(html);
      pdf.fromHTML(html, 15, 15, options, function (dispose) {
        createGraphPages();
      });


      function createGraphPages() {
        // for each graph, title and graph
        for (var i = 0; i < $scope.evaluation.questions.length; i++) {
          if ($scope.evaluation.questions[i].type == "Descriptive") {
            continue;
          }
          pdf.addPage();
          //console.log('added page')
          var html = "<h2>Q: " + $scope.evaluation.questions[i].text + "</h2>";
          //console.log(html)
          // Todo get image
          var e = document.getElementById('bar' + i);
          var imgData = e.toDataURL('image/png');

          html += "<img height='80' src='" + imgData + "' >";
          //console.log(html)
          pdf.fromHTML(html, 15, 15, options, function (dispose) {
            // console.log('saved');
          })
        }

        var reportName = $scope.evaluation.name;
        reportName = reportName.replace(/ /g, "_");
        pdf.save("Result_Graphs_" + reportName + ".pdf");
      }
    };

    $scope.downloadCommentsBtnClick = function () {
      // TODO
    }

  }]);