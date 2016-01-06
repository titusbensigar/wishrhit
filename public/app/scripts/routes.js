define([ 'angular', 'app' ], function(angular, app) {
   'use strict';

   return app.config([ '$routeProvider', function($routeProvider, $httpProvider, $locationProvider) {
      $routeProvider.when('/', {
         templateUrl : '/assets/views/homeContent.html',
         controller : 'HomeController'
      });
      $routeProvider.when('/homeContent', {
         templateUrl : '/assets/views/homeContent.html',
         controller : 'HomeController'
      });
      
      $routeProvider.otherwise({
         redirectTo : '/'
      });
   } ]);

});