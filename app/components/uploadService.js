//angular.module('app.upload', [])
//  .directive('fileModel', ['$parse', function ($parse) {
//    return {
//      restrict: 'A',
//      link: function (scope, element, attrs) {
//        var model = $parse(attrs.fileModel);
//        var modelSetter = model.assign;
//
//        element.bind('change', function () {
//          scope.$apply(function () {
//            modelSetter(scope, element[0].files[0]);
//          });
//        });
//      }
//    };
//  }])
//
//  .service('fileUpload', ['$http', function ($http) {
//    this.uploadFileToUrl = function (file, uploadUrl) {
//      var fd = new FormData();
//      fd.append('file', file);
//      $http.post(http, fd, {
//        transformRequest: angular.identity,
//        headers: {'Content-Type': undefined}
//      });
//
//      $http
//        .put('http:' + envService.read('apiUrl') + '/evaluations/' + evalId, $scope.evaluation, {
//          headers: authService.getAPITokenHeader()
//        }).then(success, fail);
//
//      .
//      success(function (response) {
//        console.log(response);
//        console.log('sent successfully')
//      })
//        .error(function (response) {
//          console.log(err);
//          console.log(error)
//        });
//    }
//  }]);
//
