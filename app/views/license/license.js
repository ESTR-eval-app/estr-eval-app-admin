'use strict';

angular.module('app.license', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/license', {
      templateUrl: 'views/license/license.html',
      controller: 'LicenseController'
    });
  }])

  .controller('LicenseController', [function () {

  }]);