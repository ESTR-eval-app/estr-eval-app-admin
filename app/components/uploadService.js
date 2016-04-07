angular.module('app.upload', [])
  .service('uploadService', ['$http', 'endpointConfig', 'authService', function ($http, endpointConfig, authService) {
    this.uploadFileToUrl = function (file, evalId, questionId, success, fail) {

      var reqHeaders = authService.getAPITokenHeader();
      reqHeaders['Content-Type'] = 'audio/mp3';

      $http.post(endpointConfig.apiEndpoint + '/evaluations/' + evalId + '/question/' + questionId + '/audio', file, {
        headers: reqHeaders,
        transformRequest: angular.identity
      }).success(function (response) {
          console.log('sent successfully');
          success(response);
        })
        .error(function (err) {
          console.log(err);
          fail(undefined, err)
        });
    };
  }]);

