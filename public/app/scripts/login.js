
var app = angular.module('loginApp',['ngRoute','pascalprecht.translate','ui.bootstrap', 'ngCookies']);
app.config( function( $controllerProvider, $provide, $compileProvider) {
	// Let's keep the older references.
	app._controller = app.controller;
	app._service = app.service;
	app._factory = app.factory;
	app._value = app.value;
	app._directive = app.directive;
 
	// Provider-based controller.
	app.controller = function( name, constructor ) {
		$controllerProvider.register( name, constructor );
		return( this );
	};
 
	// Provider-based service.
	app.service = function( name, constructor ) {
		$provide.service( name, constructor );
		return( this );
	};
 
	// Provider-based factory.
	app.factory = function( name, factory ) {
		$provide.factory( name, factory );
		return( this );
	};
 
	// Provider-based value.
	app.value = function( name, value ) {
		$provide.value( name, value );
		return( this );
	};
 
	// Provider-based directive.
	app.directive = function( name, factory ) {
		$compileProvider.directive( name, factory );
		return( this );
	};
 
// NOTE: You can do the same thing with the "filter"
// and the "$filterProvider"; but, I don't really use
// custom filters.
 
}).controller('logincontroller', ['$scope', '$http', '$location', '$window','$routeParams','$cacheFactory','$translate','$cookies','$window','$timeout',function ($scope, $http, $location, $window,$routeParams,$cacheFactory,$translate,$cookies,$window,$timeout) {

	 var console = window.console || { log: function() {} };

	 $scope.showback = true;
	 
	 $scope.secQuestn = {};
	 $scope.selectedQuestion = {};
	 $scope.userData={
	 	username:"",
	 	password:""
	 };
	 $scope.errors={};
	 $scope.errorFlag=false;
	 $scope.password={};
	 $scope.browserNameVersion='';
	 $scope.browserTest='';
	 $scope.OSName='';
	 $scope.OSTest='';
	 $scope.flashVersion='';
	 $scope.flashVersionTest='';
	 $scope.flashDownload='';
	 $scope.flashTest='';
	 $scope.adobeInstalled='';
	 $scope.adobeStatus='';
	 $scope.adobeDownloadStatus='';
	 $scope.jversion='';
	 $scope.browserDimensions='';
	 $scope.connectionTest='';
	 $scope.systemIP='';
	 $scope.connectionSpeed='';
	 $scope.timeZone='';
	 $scope.isIE  = '';
     $scope.isWin = '';
     $scope.isOpera='';
     $scope.afterLogin=false;
     $scope.unlockAcnt=false;
     $scope.emailAddress='';
     $scope.successUsername=true;
     $scope.userEmail='';
     $scope.userPassword='';
     $scope.successPassword=true;
     $scope.userNameByEmail='';
     $scope.onlyNumbers = /^\d+$/;
     $scope.reportProblem={};
     $scope.reportFeedBack='';
     $scope.loginSpin=false;
     $scope.loginDisable=false;
     $scope.error={};
     $scope.cache;
     $scope.traceIE = false;
     $scope.footerDate = new Date(); //Every Year, Footer date will update automatically;
     $scope.isFullyLoaded = false;
     
//     $scope.fromResetPassword=$scope.cache.get("fromResetPassword");
//     $scope.loginUserId=$scope.cache.get("userId");
     $scope.changePasswordData={"userId":""};
     $scope.resetPasswordErrors={};
     $scope.hideForMobile = false;
     
     $timeout(function() {
     	$window.sessionStorage.removeItem('locked');
     if($cookies.get('PLAY_SESSION') && $cookies.get('PLAY_SESSION').indexOf('userId')>0){
     	$('#loginErrors').removeClass('hide');
		$scope.errorFlag=true;
		$scope.errors.session=true;
		}
	  	document.cookie = "PLAY_SESSION=l3;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
     });
     
$scope.openPasswordModal=function(){
	$scope.clearMessages();
	$scope.successPassword=true;
	$scope.userPasswordForm.$setPristine();
	$('#passwordModal').modal({
	    backdrop: 'static',
	    keyboard: false
	});
	$('#passwordModal').modal('show');
	$scope.userPassword='';
	
} ;
$scope.username=function(){
   $scope.clearMessages();
	$scope.successUsername=true;
	$('#username').modal({
	    backdrop: 'static',
	    keyboard: false
	});
	$('#username').modal('show');
	$scope.emailAddress='';
 
 } ;
 $scope.sendUserName=function(){
	 $scope.clearMessages();
	var data = "{\"emailAddress\":\"" + $scope.emailAddress + "\"}";
		$http({method: 'POST', url: '/api/sendUsername',data:data}).
    	success(function(data, status, headers, config) {
    		$scope.showResult=data;
  			if ($scope.showResult != null && !($scope.showResult.error)  )
      			{
  					$scope.userNameByEmail= data;
  					$scope.successUsername=false;
      			}
  			else
  				{
  					$scope.getErrors();
  				}
    		
   		 }).
   		 error(function(data, status, headers, config) {
   			
    });
 };
 
 $scope.sendPassword=function(){
	 $scope.clearMessages();
	var data = "{\"username\":\"" + $scope.userPassword + "\"}";
		$http({method: 'POST', url: '/api/sendPassword',data:data}).
    	success(function(data, status, headers, config) {
    		$scope.showResult=data;
  			if ($scope.showResult != null && !($scope.showResult.error)  )
      			{
  					$scope.userEmail= data;
  					$scope.successPassword=false;
      			}
  			else
  				{
  					$scope.getErrors();
  				}
    		
   		 }).
   		 error(function(data, status, headers, config) {
   			
    });
	 
 };
$scope.unlockAccount=function(){
	 $scope.getSecQuestn();
};

$scope.accountPermanentLock=function(userId){
   var data = "{\"userId\":\"" + userId + "\"}";
   $http({
      method : 'POST',
      url : '/api/accountPermanentLock',
      data : data
   }).success(function(data, status, headers, config) {
      if (data != null  && data=='SUCCESS' )
      {
         $scope.error.newUserPermanentLock='There are no security questions setup in your account, please contact Customer Service.';
         $scope.errorFlag=true;
         $('#loginErrors').removeClass('hide');
         $scope.errors.unlock='';
         $scope.errors.unlockAccount='';
      }
   }).error(function(data, status, headers, config) {
   // called asynchronously if an error occurs
   // or server returns response with an error status.
   });
};



$scope.loginEnter=function(keyEvent){
	if (keyEvent.which === 13)
    $scope.login();
}

	$scope.logout=function() {
		$scope.login();
	}

   $scope.login=function(){
	   console.log('login');
	   		if(navigator.userAgent.indexOf('MSIE 9') > 0) {
	   			$scope.traceIE = true;
	   		}
			$scope.clearMessages();
			var data=angular.toJson($scope.userData);
			$scope.loginSpin=true;
			 $scope.loginDisable=true;
			 $scope.errors={};
			 $scope.loginError=[];
			 if($scope.userData.username==''){
			    $scope.loginError.push($translate.instant('username.required'));
			 }
			 if($scope.userData.password==''){
			    $scope.loginError.push($translate.instant('password.required'));
			 }
			 if($scope.loginError.length!=0){
			    $scope.errorFlag=true;
			    $('#loginErrors').removeClass('hide');
			    $scope.loginSpin=false;
			    $scope.loginDisable=false;
			    return false;
			 }
			 
			  	document.cookie = "PLAY_SESSION=l3;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
			  
			$http({method: 'POST', url: '/api/firstLogin',data:data}).
		    	success(function(data, status, headers, config) {
		    		$scope.response=data;
		    		
	      			if (data != null && !(data.error) && data.result=='SUCCESS' )
		      			{	
	      					if(data.resetpass) {
	      						$('.widget-box.visible').removeClass('visible');//hide others
	      						$("#resetpassword-box").addClass('visible');//show target
	      						$("#resetpassword-box").show();
	      					} else {
	      						$window.sessionStorage.setItem('loginTime',data.loginTime);
	      						window.location.pathname='/home.html';
	      					}
		      			}
	      			else
	      				{
	      					$scope.errors=data;
	      					$scope.userData.password='';
//	      					$scope.cache.put("userId",$scope.errors.userId);
//                  $scope.cache.put("userName",$scope.errors.userName)
	      					$scope.errorFlag=true;
	      					$('#loginErrors').removeClass('hide');
	      					if($scope.errors!=undefined && $scope.errors.flag!=undefined)
	      					{
	      						redirectNewUser();
	      					}
	      						$scope.loginSpin=false;
	      						$scope.loginDisable=false;
	      				}

	      			$window.sessionStorage.removeItem('showDialog');
		   		 }).
		   		 error(function(data, status, headers, config) {
		   			$scope.loginSpin=false;
			 		$scope.loginDisable=false;
		    });


		};
		
		$scope.resetpass=function(){
			   console.log('resetpass');
			   		if(navigator.userAgent.indexOf('MSIE 9') > 0) {
			   			$scope.traceIE = true;
			   		}
					$scope.clearMessages();
					var data=angular.toJson($scope.userData);
					$scope.loginSpin=true;
					 $scope.loginDisable=true;
					 $scope.errors={};
					 $scope.loginError=[];
					 if($scope.userData.remail==''){
					    $scope.loginError.push($translate.instant('email.required'));
					 }
					 if($scope.userData.oldpassword==''){
					    $scope.loginError.push($translate.instant('oldpassword.required'));
					 }
					 if($scope.userData.newpassword==''){
					    $scope.loginError.push($translate.instant('newpassword.required'));
					 }
					 if($scope.loginError.length!=0){
					    $scope.errorFlag=true;
					    $('#loginErrors').removeClass('hide');
					    $scope.loginSpin=false;
					    $scope.loginDisable=false;
					    return false;
					 }
					 
					  	document.cookie = "PLAY_SESSION=l3;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
					  
					$http({method: 'POST', url: '/api/resetpassword',data:data}).
				    	success(function(data, status, headers, config) {
				    		$scope.response=data;
				    		
			      			if (data != null && !(data.error) && data.result=='SUCCESS' )
				      			{	
		      						$window.sessionStorage.setItem('loginTime',data.loginTime);
		      						window.location.pathname='/home.html';
				      			}
			      			else
			      				{
			      					$scope.errors=data;
			      					$scope.userData.password='';
//			      					$scope.cache.put("userId",$scope.errors.userId);
//		                  $scope.cache.put("userName",$scope.errors.userName)
			      					$scope.errorFlag=true;
			      					$('#loginErrors').removeClass('hide');
			      					if($scope.errors!=undefined && $scope.errors.flag!=undefined)
			      					{
			      						redirectNewUser();
			      					}
			      						$scope.loginSpin=false;
			      						$scope.loginDisable=false;
			      				}

			      			$window.sessionStorage.removeItem('showDialog');
				   		 }).
				   		 error(function(data, status, headers, config) {
				   			$scope.loginSpin=false;
					 		$scope.loginDisable=false;
				    });


				};
		
		$scope.forgotpass=function(){
			   console.log('forgotpass');
			   		if(navigator.userAgent.indexOf('MSIE 9') > 0) {
			   			$scope.traceIE = true;
			   		}
					$scope.clearMessages();
					var data=angular.toJson($scope.userData);
					$scope.loginSpin=true;
					 $scope.loginDisable=true;
					 $scope.errors={};
					 $scope.loginError=[];
					 if($scope.userData.femail==''){
					    $scope.loginError.push($translate.instant('email.required'));
					 }
					 if($scope.loginError.length!=0){
					    $scope.errorFlag=true;
					    $('#loginErrors').removeClass('hide');
					    $scope.loginSpin=false;
					    $scope.loginDisable=false;
					    return false;
					 }
					 
					  	document.cookie = "PLAY_SESSION=l3;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
					  
					$http({method: 'POST', url: '/api/forgotPass',data:data}).
				    	success(function(data, status, headers, config) {
				    		$scope.response=data;
				    		
			      			if (data != null && !(data.error) && data.result=='SUCCESS' )
				      			{	
				      				$window.sessionStorage.setItem('loginTime',data.loginTime);
			      						window.location.pathname='/home.html';
				      			}
			      			else
			      				{
			      					$scope.errors=data;
			      					$scope.userData.password='';
//			      					$scope.cache.put("userId",$scope.errors.userId);
//		                  $scope.cache.put("userName",$scope.errors.userName)
			      					$scope.errorFlag=true;
			      					$('#loginErrors').removeClass('hide');
			      					if($scope.errors!=undefined && $scope.errors.flag!=undefined)
			      					{
			      						redirectNewUser();
			      					}
			      						$scope.loginSpin=false;
			      						$scope.loginDisable=false;
			      				}

			      			$window.sessionStorage.removeItem('showDialog');
				   		 }).
				   		 error(function(data, status, headers, config) {
				   			$scope.loginSpin=false;
					 		$scope.loginDisable=false;
				    });


				};

		$scope.signup=function(){
			   console.log('signup');
			   		if(navigator.userAgent.indexOf('MSIE 9') > 0) {
			   			$scope.traceIE = true;
			   		}
					$scope.clearMessages();
					var data=angular.toJson($scope.userData);
					$scope.loginSpin=true;
					 $scope.loginDisable=true;
					 $scope.errors={};
					 $scope.loginError=[];
					 if($scope.userData.email==''){
					    $scope.loginError.push($translate.instant('email.required'));
					 }
					 if($scope.userData.fullname==''){
					    $scope.loginError.push($translate.instant('fullname.required'));
					 }
					 /*if($scope.userData.phone==''){
					    $scope.loginError.push($translate.instant('phone.required'));
					 }*/
					 if($scope.userData.spassword==''){
					    $scope.loginError.push($translate.instant('password.required'));
					 }
					 if($scope.loginError.length!=0){
					    $scope.errorFlag=true;
					    $('#loginErrors').removeClass('hide');
					    $scope.loginSpin=false;
					    $scope.loginDisable=false;
					    return false;
					 }
					 
					  	document.cookie = "PLAY_SESSION=l3;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
					  
					$http({method: 'POST', url: '/api/signup',data:data}).
				    	success(function(data, status, headers, config) {
				    		$scope.response=data;
				    		
			      			if (data != null && !(data.error) && data.result=='SUCCESS' )
				      			{	
				      				$window.sessionStorage.setItem('loginTime',data.loginTime);
			      						window.location.pathname='/home.html';
				      			}
			      			else
			      				{
			      					$scope.errors=data;
			      					$scope.userData.spassword='';
//			      					$scope.cache.put("userId",$scope.errors.userId);
//		                  $scope.cache.put("userName",$scope.errors.userName)
			      					$scope.errorFlag=true;
			      					$('#loginErrors').removeClass('hide');
			      					if($scope.errors!=undefined && $scope.errors.flag!=undefined)
			      					{
			      						redirectNewUser();
			      					}
			      						$scope.loginSpin=false;
			      						$scope.loginDisable=false;
			      				}

			      			$window.sessionStorage.removeItem('showDialog');
				   		 }).
				   		 error(function(data, status, headers, config) {
				   			$scope.loginSpin=false;
					 		$scope.loginDisable=false;
				    });


				};
		
$scope.loginBack=function(){
   $location.path('/');
	$('#login1').show();
	
}
		$scope.getErrors = function() {

            if ($scope.showResult.error.Question1 != null) {
                $scope.error.Question1 = $scope.showResult.error.Question1;
            }  if ($scope.showResult.error.Response1 != null) {
                $scope.error.Response1 = $scope.showResult.error.Response1;
            }  if ($scope.showResult.error.Question2 != null) {
                $scope.error.Question2 = $scope.showResult.error.Question2;
            }  if ($scope.showResult.error.Response2 != null) {
                $scope.error.Response2 = $scope.showResult.error.Response2;
            }  if ($scope.showResult.error.Question3 != null) {
                $scope.error.Question3 = $scope.showResult.error.Question3;
            }  if ($scope.showResult.error.Response3 != null) {
                $scope.error.Response3 = $scope.showResult.error.Response3;
            }  if ($scope.showResult.error.Questions != null) {
                $scope.exception = $scope.showResult.error.Questions;
            }  if ($scope.showResult.error.responseError != null) {
                $scope.exception = $scope.showResult.error.responseError;
            }	if ($scope.showResult.error.E_10002_8 != null) {
                $scope.exception = $scope.showResult.error.E_10002_8;
            }	if($scope.showResult.error.userName!=null){
            	$scope.exception=$scope.showResult.error.userName;
            }	if($scope.showResult.error.userEmailAddress!=null){
            	$scope.exception=$scope.showResult.error.userEmailAddress;
            }	if($scope.showResult.error.invalidEmail!=null){
            	$scope.exception=$scope.showResult.error.invalidEmail;
            }	if($scope.showResult.error.uname!=null){
            	$scope.error.user_name=$scope.showResult.error.uname;
            }	if($scope.showResult.error.emailAddress!=null){
            	$scope.error.emailAddress=$scope.showResult.error.emailAddress;
            }	if($scope.showResult.error.phone!=null){
            	$scope.error.phone=$scope.showResult.error.phone;
            }	if($scope.showResult.error.state!=null){
            	$scope.error.state=$scope.showResult.error.state;
            }	if($scope.showResult.error.message!=null){
            	$scope.error.message=$scope.showResult.error.message;
            }	if($scope.showResult.error.unameLength!=null){
            	$scope.error.unameLength=$scope.showResult.error.unameLength;
            }	if($scope.showResult.error.emailLength!=null){
            	$scope.error.emailLength=$scope.showResult.error.emailLength;
            }	if($scope.showResult.error.phoneLength!=null){
            	$scope.error.phoneLength=$scope.showResult.error.phoneLength;
            }	if($scope.showResult.error.stateLength!=null){
            	$scope.error.stateLength=$scope.showResult.error.stateLength;
            }	if($scope.showResult.error.usernameLength!=null){
            	$scope.error.usernameLength=$scope.showResult.error.usernameLength;
            }	if($scope.showResult.error.instLength!=null){
            	$scope.error.instLength=$scope.showResult.error.instLength;
            }	if($scope.showResult.error.siteLength!=null){
            	$scope.error.siteLength=$scope.showResult.error.siteLength;
            }
            
            else {
                $scope.errors = $translate.instant('users.unknown.error');
            }
        };
        
        $scope.clearMessages=function(){
        	 
        	$scope.error.emailAddress='';
        	$scope.error.phone='';
        	$scope.error.state='';
        	$scope.error.message='';
        	$scope.exception='';
        	$scope.reportFeedBack='';
        	$scope.error.permanentLock='';
        	$scope.error.newUserPermanentLock=''
        	$scope.errorFlag=false;
        	$('#loginErrors').addClass('hide');
        	$scope.resetPasswordErrors = {};
        }

        $scope.loginValidate=function(){
		var data=$scope.userData;
			$http({method: 'GET', url: '/api/loginApi',data:data}).
		    	success(function(data, status, headers, config) {
		    		$scope.response=data;
		   		 }).
		   		 error(function(data, status, headers, config) {
		    });
	};
	
	
	
	$scope.init=function(){
	   if ((window.location.pathname == '/home.html') && $location.path()!='/newUser' ){
	      $scope.errorFlag=true;
	      $('#loginErrors').removeClass('hide');
	      $scope.error.permanentLock=$translate.instant('user.permanentLock.msg');
	   }
	   
	   if ((window.location.pathname == '/registernew') ){
		   $('.widget-box.visible').removeClass('visible');//hide others
			$("#signup-box").addClass('visible');//show target
			$("#signup-box").show();
	   }
	   
	   if ((window.location.pathname == '/showlogin') ){
		   $('.widget-box.visible').removeClass('visible');//hide others
			$("#login-box").addClass('visible');//show target
			$("#login-box").show();
	   }
	   
	   if($scope.$last === true) {
		   console.log("fully loaded")
		   $scope.isFullyLoaded = true;
	   }
	};
	

	$scope.init();
	
 // dat={"username":"The Username or Password you entered is not valid. Please try again."};
}]);

