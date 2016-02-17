'use strict';

angular.module('app.nav', ['ngRoute'])

  .controller('navController', ['$scope', '$location', function($scope, $location) {
    console.log($location.path());
    //TODO check
    $scope.templateUrl = (window.localStorage['token']) ? 'views/nav/nav_private.html' : 'views/nav/nav_public.html' ;

    $scope.isActive = function(location) {
      return location == $location.path();
    };

    $scope.reloadNav = function () {

    };

    $scope.logout = function() {
      console.log("Logging out");
      window.localStorage.removeItem("token");
    };

  }]);
