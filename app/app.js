'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'environment',
  'angular-chartist',
  'app.auth',
  //'app.upload',
  'app.nav',
  'app.home',
  'app.license_privacy',
  'app.login',
  'app.evaluations',
  'app.new-evaluation',
  'app.view-evaluation',
  'app.view-results'

]).config(['$routeProvider', 'envServiceProvider', function ($routeProvider, envServiceProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});

  envServiceProvider.config({
    domains: {
      development: ["localhost"],
      production: ["stevenlyall.me"]
    },
    vars: {
      development: {
        apiUrl: "//localhost:3000/api"
      },
      production: {
        apiUrl: "//stevenlyall.me:3000/api"
      }
    }
  });

  envServiceProvider.check();
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
