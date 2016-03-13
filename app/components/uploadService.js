angular.module('app.upload', [])
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }])

  .service('fileUpload', ['$http', 'envService', 'authService', function ($http, envService, authService) {
    this.uploadFileToUrl = function (file, evalId, questionId, success, fail) {

      var reqHeaders = authService.getAPITokenHeader;
      reqHeaders['Content-Type'] = 'audio/mp3';

      $http.post('http:' + envService.read('apiUrl') + '/evaluations/' + evalId + '/question/' + questionId + '/audio', file, {
        headers: reqHeaders,
        transformRequest: angular.identity
      }).success(function (response) {
          console.log('sent successfully');
          success(response);
        })
        .error(function (err) {
          console.log(error);
          fail(err)
        });
    };
    // TODO check file size and only mp3
  }]);

