'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', [function() {

}]);