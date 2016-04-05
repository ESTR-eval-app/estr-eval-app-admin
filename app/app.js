'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'config',
  'ngRoute',
  'chart.js',
  'ngFileUpload',
  'app.auth',
  'app.upload',
  'app.nav',
  'app.home',
  'app.license_privacy',
  'app.login',
  'app.evaluations',
  'app.new-evaluation',
  'app.view-evaluation',
  'app.view-results'

]).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function($rootScope, $location, authService) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    if (!authService.isUserAuthenticated()) {
      // if not logged in, show login
      if ( next.templateUrl === "views/login/login.html") {
      } else {
        $location.path("/home");
      }
    }
  });
});
