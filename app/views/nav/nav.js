'use strict';

angular.module('myApp.nav', ['ngRoute'])

  .controller('navController', ['$scope', '$location', function($scope, $location) {
    console.log($location.path());
    $scope.templateUrl = 'views/nav/nav.html';
    //TODO navs for other paths
    //$scope.templateUrl = (path==='/signin' || path==='/contact') ? 'template/header4signin.html' : 'template/header4normal.html' ;


    $scope.isActive = function(location) {
      return location == $location.path();
    };


  }]);
//  }
//]);