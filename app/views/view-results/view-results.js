'use strict';

angular.module('app.view-results', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view-results/:evalId', {
      templateUrl: 'views/view-results/view-results.html',
      controller: 'ViewResultsController'
    });
  }])

  .controller('ViewResultsController', ['$routeParams', '$location', '$scope', '$http', 'authService', 'endpointConfig', function ($routeParams, $location, $scope, $http, authService, endpointConfig) {

    Chart.defaults.global.colours[0] = "#4D5360";

    var evalId = $routeParams.evalId;
    getEvaluation(evalId);
    getResultsForEvaluation(evalId);

    function getEvaluation(id) {
      $http
        .get(endpointConfig.apiEndpoint + '/evaluations/' + id, {
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
        .get(endpointConfig.apiEndpoint + '/evaluations/' + id + '/results', {
          headers: authService.getAPITokenHeader()
        }).then(success, fail);

      function success(response) {
        $scope.results = response.data;
        // $scope.results.responsesStartDate = getAndFormatDateTime($scope.results.responsesStartDate);
        // $scope.results.responsesEndDate = getAndFormatDateTime($scope.results.responsesEndDate);


        try {
          getChartData();
        }
        catch (err) {
          //console.error(err)
        }
        // console.log($scope.results.qualitativeResponses)
      }

      function fail(response) {
        console.error(response.data);
      }

    }

    // todo account for NA or DK responses and scale, currently ignored
    function getChartData() {
      $scope.type = "HorizontalBar";
      $scope.chartData = [];
      $scope.results.responseCounts.forEach(function (value, index, responses) {
        var chart = {
          series: ["Series"],
          labels: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
          data: []
        };
        var respDistribution = [0, 0, 0, 0];
        Object.keys(value.responses).forEach(function (key) {
          respDistribution[key - 1] = value.responses[key];
        });
        respDistribution = respDistribution.slice(0, 4); // TODO only dealing with 1-4 scale items, deal with string keys?
        chart.data[0] = respDistribution;
        $scope.chartData.push(chart);
      });
    }

    $scope.downloadGraphsBtnClick = function () {
      var pdf = new jsPDF();
      var options = {width: 170};
      var html = "<h1> Eval <sup>n</sup></h1>";
      html += "<h1>Quantitative Response Distibution Report</h1><br><br><br>";
      html += "<p>Generated on <b>" + getAndFormatDateTime(new Date()) + "</b><p><br><br><br>";
      html += "<br><br><br>";
      html += "<p> Response data collected between <b>" + $scope.results.responsesStartDate +
        "</b> and <b>" + $scope.results.responsesEndDate + "</b></p><br><br>";
      html += "<p># of completed evaluations received: <b>" + $scope.results.numResponses + "</b></p><br><br>";

      pdf.fromHTML(html, 15, 15, options, function (dispose) {
        createGraphPages();
      });


      function createGraphPages() {
        var pagesDone = 0;

        var questions = $scope.evaluation.questions.filter(function (question) {
          return question.type != "Descriptive";
        });

        // for each graph, title and graph
        for (var i = 0; i < questions.length; i++) {
          //console.log('added page')
          var html = "<h2>Question Responses</h2>";
          html += '<h2>"' + questions[i].text + '"</h2>';

          var e = document.getElementById('bar' + i);
          var imgData = e.toDataURL('image/png');

          html += "<img height='80' src='" + imgData + "' >";
          pdf.fromHTML(html, 15, 15, options, function (dispose) {
            console.log('saved');
            pagesDone++;
            if (pagesDone == 5) {
              saveReport(pdf, "Graphs");
            }
          });
          pdf.addPage();
        }
      }
    };

    $scope.downloadCommentsBtnClick = function () {
      var pdf = new jsPDF();
      var options = {width: 170};
      var html = "<h1> Eval <sup>n</sup></h1>";
      html += "<h1>Qualitative Response Report</h1><br><br><br>";
      html += "<p>Generated on <b>" + getAndFormatDateTime(new Date()) + "</b><p><br><br><br>";
      html += "<br><br><br>";
      html += "<p>";
      if ($scope.evaluation.isAnonymous) {
        html += "Anonymous responses";
      }
      else {
        html += "Responses";
      }
      html += " collected between <b>" + $scope.results.responsesStartDate +
        "</b> and <b>" + $scope.results.responsesEndDate + "</b></p><br><br>";
      html += "<p># of completed evaluations received: <b>" + $scope.results.numResponses + "</b></p><br><br>";
      pdf.fromHTML(html, 15, 15, options, function (dispose) {
        pdf.addPage();
        addCommentsToReport();
      });

      function addCommentsToReport() {
        pdf.fromHTML($("#comments").get(0), 15, 15, options, function (dispose) {
          saveReport(pdf, "Comments");
        });
      }
    };

    function saveReport(pdf, reportType) {
      var reportName = $scope.evaluation.name;
      reportName = reportName.replace(/ /g, "_");
      pdf.save("Report_" + reportType + "_" + reportName + ".pdf");
    }

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
    
  }]);