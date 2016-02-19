'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'app.auth',
  'app.nav',
  'app.home',
  'app.login',
  'app.evaluations',
  'app.new-evaluation',
  'app.view-evaluation'

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
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
