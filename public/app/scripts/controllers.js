define([ 'angular', 'services' ], function(angular) {
   'use strict';

   /* Controllers */

   return angular.module('controllers', [ 'services' ])
   // Sample controller where service is being used
   .controller('HomeController', [ '$scope', '$injector', function($scope, $injector) {
      require([ 'controllers/home_controller' ], function(homeCtrl) {
         // injector method takes an
         // array of modules as the
         // first argument
         // if you want your
         // controller to be able to
         // use components from
         // any of your other
         // modules, make sure you
         // include it together with
         // 'ng'
         // Furthermore we need to
         // pass on the $scope as
         // it's unique to this
         // controller
         $injector.invoke(homeCtrl, this, {
            '$scope' : $scope
         });
      });
   } ])
    ;
});
