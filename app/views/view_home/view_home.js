'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/view_home/view_home.html',
    controller: 'HomeController'
  });
}])

.controller('HomeController', [function() {

}]);