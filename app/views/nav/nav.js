'use strict';

angular.module('myApp.nav', ['ngRoute'])

  .controller('navController', ['$scope', '$location', function($scope, $location) {
    console.log($location.path());
    //TODO navs for other paths, check auth
    $scope.templateUrl = 'views/nav/nav_private.html';
  //  $scope.templateUrl = (path==='/home') ? 'views/nav/nav_public.html' : 'views/nav/nav_private.html' ;

    $scope.isActive = function(location) {
      return location == $location.path();
    };


  }]);
//  }
//]);