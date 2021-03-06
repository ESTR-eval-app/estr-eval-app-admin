'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginController'
  });
}])

  .controller('LoginController', ['$scope', '$http', '$location', 'authService', 'endpointConfig', function ($scope, $http, $location, authService, endpointConfig) {

  $scope.attemptLogin = function () {
    $http.post(endpointConfig.apiEndpoint + '/authenticate', $scope.user).then(authSuccess, authFailed);
  };

  function authSuccess(response) {
    authService.login(response.data.token);
    $location.path('/evaluations');

  }

  function authFailed(response) {
    if (response.status == 403) {
      $scope.isLoginAuthFail = true;
    }
    else {
      console.log('fail');
      $scope.isLoginError = true;
    }
  }

}]);