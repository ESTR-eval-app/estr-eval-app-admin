'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'app.nav',
  'app.home',
  'app.login',
  'app.evaluations',
  'app.new-evaluation'

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function($rootScope, $location) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    if (!window.localStorage['token']) {
      // if not logged in, show login
      if ( next.templateUrl === "views/login/login.html") {
      } else {
        $location.path("/login");
      }
    }
  });
});
