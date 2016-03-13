'use strict';

angular.module('app.license_privacy', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/license', {
        templateUrl: 'views/license_privacy/license.html',
        controller: 'LicenseController'
      })
      .when('/privacy', {
        templateUrl: 'views/license_privacy/privacy.html',
        controller: 'PrivacyController'
      });
  }])

  .controller('LicenseController', [function () {

  }])
  .controller('PrivacyController', [function () {

  }]);