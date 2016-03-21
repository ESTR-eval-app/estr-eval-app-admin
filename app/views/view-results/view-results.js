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
        //    getResponseDistributions();
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


    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];

    // $scope.chartLabels = ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"];
    // $scope.series = ["series A"];
    // todo if NA or DK resps allowed, append to labels array
    // TODO move this in case needs to be changed


    // // TODO move to server
    // function getResponseDistributions() {
    //   $scope.chartsData = [];
    //   $scope.results.responseCounts.forEach(function (value, index, responses) {
    //     var respDistribution = [0, 0, 0, 0];
    //     Object.keys(value.responses).forEach(function (key) {
    //       respDistribution[key - 1] = value.responses[key];
    //     });
    //     var data = {
    //       data : respDistribution
    //     };
    //     console.log(data)
    //     $scope.chartsData.push(data);
    //   })
    //
    // }


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
      pdf.setFontSize(30);
      pdf.text("Eval n");
      pdf.text("Quantitative Response Distribution Report");

      pdf.fromHTML($('#reportHead').get(0), 15, 15, options, function (dispose) {
        createGraphPages();
      });


      function createGraphPages() {
        // for each graph, title and graph
        for (var i = 0; i < $scope.evaluation.questions.length; i++) {
          if ($scope.evaluation.questions[i].type == "Descriptive") {
            continue;
          }
          pdf.addPage();
          var html = "<h2>Q: " + $scope.evaluation.questions[i].text + "</h2>";
          // Todo get image
          var e = document.getElementById('bar' + i);
          var imgData = e.toDataURL('image/jpeg');
          html += "<img> src=" + imgData + " </img>";
          pdf.fromHTML(html, 15, 15, options, function (dispose) {
            console.log(saved);
          })
        }

        pdf.save();
      }

      // var doc = document.body.cloneNode();
      // pdfDoc.appendChild(head);
      //
      // var sectionHead = document.createElement('h3');
      // sectionHead.innerHTML = "Distribution of Responses";
      //
      // pdfDoc.appendChild(sectionHead);
      //


      // var graphImages = [];

      //
      // // var i = 0;
      // // var canvases = document.getElementById('bar' + i);
      // // console.log(canvases)
      // // for (var canvas in canvases) {
      // //   console.log(typeof canvas)
      // //   console.log(canvas)
      // //   graphImages.push(canvas.toDataURL('image/jpeg'));
      // // }
      // //
      // // console.log(graphImages)
      // //var url=document.getElementById("bar").toDataURL();
      // // console.log(url)
      //
      //
      //
      // //pdf.fromHTML($('#graphs').get(0), 15, 15, {
      // //
      // //});
      // pdf.addHTML(document.getElementById('reportHead'), function () {
      //   pdf.save('test.pdf');
      // });
      // pdf.addImage(url, 'JPEG', 15, 40, 180, 180);
      //   pdf.addHTML(doc, 15, 15, {
      //     'width': 170
      //   }, function() {
      //     pdf.save();
      //   });

    };

    $scope.downloadCommentsBtnClick = function () {
      // TODO
    }

  }]);