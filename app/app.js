'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'environment',
  'app.auth',
  'app.nav',
  'app.home',
  'app.login',
  'app.evaluations',
  'app.new-evaluation',
  'app.view-evaluation'

]).config(['$routeProvider', 'envServiceProvider', function ($routeProvider, envServiceProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});

  envServiceProvider.config({
    domains: {
      development: ["localhost"],
      production: ["stevenlyall.me"]
    },
    vars: {
      development: {
        apiUrl: "//localhost"
      },
      production: {
        productionUrl: "//stevenlyall.me"
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
        $location.path("/login");
      }
    }
  });
});
