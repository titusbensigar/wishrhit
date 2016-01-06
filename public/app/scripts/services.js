define(['angular', 'angularDialog'], function(angular,angularDialog) {
    'use strict';

    /* Services */

    // Demonstrate how to register services
    // In this case it is a simple value service.
    angular.module('services', ['dialogs.main']).service('DTService', function() {
        this.dtToJson = function(dtData) {
            var temp = [];
            angular.forEach(dtData, function(value, key) {
                this.push(value.name + ': ' + value.value);
            }, temp);
            return temp;
        };
    }).service('util', function() {
        return {
            isMobile: function() {
                return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
            },
            isAndroid: function() {
                return navigator.userAgent.match(/Android/i);
            },
            isBlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            isIOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            isOpera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            isWindows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            }

        }
    }).service('loginService', function($rootScope, $http, authService, $location, $window, $route, $timeout,$cookies,dialogs,$translate) {
            var lockLogin=false;
        
        return {
            login: function(_scope) {

                var self = this;
                var user = {};
                user.username = _scope.loginUser.username;
                user.password = _scope.loginUser.password;
                user.errorFlag = _scope.loginUser.errorFlag;

                _scope.loginUser.unlockSpin = true;
                _scope.loginUser.loginDisable = true;
                _scope.loginUser.errorFlag = false;

                _scope.errors = {};
                _scope.loginError = [];

                if (_scope.loginUser.username == '') {
                    _scope.loginError.push('Username is required');
                }
                if (_scope.loginUser.password == '') {
                    _scope.loginError.push('Password is required');
                }
                if (_scope.loginError.length != 0) {
                    //console.log("authservice login...................loginError.length!=0..");
                    _scope.loginUser.errorFlag = true;
                    _scope.loginUser.unlockSpin = false;
                    _scope.loginUser.loginDisable = false;
                    //_scope.loginSpin=false;
                    //_scope.loginDisable=false;
                    return true;
                }
                $('#sessionError').addClass('hidden');
                
            	if(authService.getAtWin()!=undefined && !authService.getAtWin().closed){
                
                     
                	  var dlg =dialogs.confirm($translate.instant('administertest.close.header'),$translate.instant('administertest.close.msg'))

		        	   dlg.result.then(function(btn){

                           authService.logout(_scope); 
		                   $http({
		                       method: 'POST',
		                       url: '/api/firstLogin',
		                       data: angular.toJson(user)
		                   }).
		                   success(function(data, status, headers, config) {
		                	   authService.getAtWin().close();
		                       _scope.loginUser.unlockSpin = false;
		                       _scope.loginUser.loginDisable = false;
		                       if (data != null && !(data.error) && data.result == 'SUCCESS') {

		                           authService.authToken = true;
		                           authService.setLoginTime();
		                           
		                           
		                           $window.sessionStorage.removeItem('locked');
		                           $window.sessionStorage.setItem('loginTime',data.loginTime);

		                           
		                           $('#login').modal('hide');
		                           authService.resetLogout();
		                           self.initUser(_scope);
		                           lockLogin=true;
		                           
		                           $timeout(function() {
		                           	_scope.csrf = $cookies.get('XSRF-TOKEN');
		                           $("input[name='X-XSRF-TOKEN']").val($cookies.get('XSRF-TOKEN'));
		                           }, 100);

		                          
		                       } else {
		                           _scope.loginUser.unlockSpin = false;
		                           _scope.errors = data;
		                           _scope.cache.put("userId", _scope.errors.userId);
		                           _scope.cache.put("userName", _scope.errors.userName)
		                           _scope.loginUser.errorFlag = true;
		                           if (_scope.errors != undefined && _scope.errors.flag != undefined) {
		                               redirectNewUser();
		                           }
		                           
		                       }

		                   }).
		                   error(function(data, status, headers, config) {
		                       _scope.loginUser.unlockSpin = false;
		                       _scope.loginUser.loginDisable = false;
		                   });
		                    
		        	   },function(btn){
		        		   _scope.loginUser.errorFlag = false;
		                    _scope.loginUser.unlockSpin = false;
		                    _scope.loginUser.loginDisable = false;
		                    return true;
				        });
            	}
            	else{
                    authService.logout(_scope);
                      $http({
                         method: 'POST',
                         url: '/api/firstLogin',
                         data: angular.toJson(user)
                     }).
                     success(function(data, status, headers, config) {
                         _scope.loginUser.unlockSpin = false;
                         _scope.loginUser.loginDisable = false;
                         if (data != null && !(data.error) && data.result == 'SUCCESS') {

                             authService.authToken = true;
                             authService.setLoginTime();
                             
                              
                             
                             $window.sessionStorage.removeItem('locked');
                             $window.sessionStorage.setItem('loginTime',data.loginTime);

                             // $('#sessionError').addClass('hidden');
                             $('#login').modal('hide');
                             authService.resetLogout();
                             self.initUser(_scope);
                             lockLogin=true;
                             
                             $timeout(function() {
                             	_scope.csrf = $cookies.get('XSRF-TOKEN');
                             $("input[name='X-XSRF-TOKEN']").val($cookies.get('XSRF-TOKEN'));
                             }, 100);
 
                         } else {
                             _scope.loginUser.unlockSpin = false;
                             _scope.errors = data;
                             _scope.cache.put("userId", _scope.errors.userId);
                             _scope.cache.put("userName", _scope.errors.userName)
                             _scope.loginUser.errorFlag = true;
                             if (_scope.errors != undefined && _scope.errors.flag != undefined) {
                                 redirectNewUser();
                             }
                           
                         }

                     }).
                     error(function(data, status, headers, config) {
                         _scope.loginUser.unlockSpin = false;
                         _scope.loginUser.loginDisable = false;
                     });
            	}
            	
                _scope.loginUser.password = "";

            },
            initUser: function(_scope) {}
        }
    });


});
