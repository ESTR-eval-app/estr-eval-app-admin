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
    this.uploadFileToUrl = function (file, evalId, questionId) {

      var reqHeaders = authService.getAPITokenHeader;
      reqHeaders['Content-Type'] = 'audio/mp3';

      $http.post('http:' + envService.read('apiUrl') + '/evaluations/' + evalId + '/question/' + questionId + '/audio', file, {
        headers: reqHeaders,
        transformRequest: angular.identity
      }).success(function (response) {
          console.log(response);
          console.log('sent successfully')
        })
        .error(function (response) {
          console.log(err);
          console.log(error)
        });
    };
    // TODO check file size and only mp3
  }]);

