app.config(function($routeProvider){
    $routeProvider
    .when('/registernew', {
			templateUrl:'/assets/views/login.html',
			resolve: {
				deps:function($q, $rootScope){
					var dependencies =['/assets/scripts/login.js'];
					return resolveDeps($q, $rootScope, dependencies)
				}
			}
		}).when('/login', {
			templateUrl:'/assets/views/login.html',
			resolve: {
				deps:function($q, $rootScope){
					var dependencies =['/assets/scripts/login.js'];
					return resolveDeps($q, $rootScope, dependencies)
				}
			}
		})
		.when('/resetPassword', {
	     
		   templateUrl:'/assets/views/user/resetPassword.html',
	      resolve: {
	        deps:function($q, $rootScope){
	          var dependencies =['/assets/scripts/cat/controllers/users/resetPassword_controller.js', ];
	          return resolveDeps($q, $rootScope, dependencies)
	        }
	      }
	    }).when('/unlockAccount', {
	       
	       templateUrl:'/assets/views/user/resetPassword.html',
	        resolve: {
	          deps:function($q, $rootScope){
	            var dependencies =['/assets/scripts/cat/controllers/users/resetPassword_controller.js', ];
	            return resolveDeps($q, $rootScope, dependencies)
	          }
	        }
	      }).when('/newUser', {
	         
	         templateUrl:'/assets/views/user/resetPassword.html',
	          resolve: {
	            deps:function($q, $rootScope){
	              var dependencies =['/assets/scripts/cat/controllers/users/resetPassword_controller.js', ];
	              return resolveDeps($q, $rootScope, dependencies)
	            }
	          }
	        })
  });

	var resolveDeps = function($q, $rootScope, dependencies){
					var deferred = $q.defer();
					$script(dependencies, function()
					{
						$rootScope.$apply(function()
						{
							deferred.resolve();
						});
					});
				return deferred.promise;
			}
	