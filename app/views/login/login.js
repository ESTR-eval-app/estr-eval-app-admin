'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.attemptLogin = function () {
    console.log($scope.user);
    $http.post('http://localhost:3000/api/authenticate', $scope.user).then(authSuccess, authFailed);
  };

  function authSuccess(response) {
    window.localStorage['token'] = response.data.token;
    $location.path('/evaluations');

  }

  function authFailed(response) {
    if (response.status == 403) {
      console.log('not authorized'); // TODO
    }
    else {
      console.log('fail');
    }
  }

}]);