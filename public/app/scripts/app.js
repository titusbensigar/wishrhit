define([
    'angular',
    'filters',
    'services',
    'factories',
    'directives',
    'controllers',
    'angularRoute',
    'angularCookies',
    'angularui',
    'angularDialog',
    'angulartics',
    'angularGa',
    'ngFileUpload'
    // 'loadbar'


], function(angular, filters, services, factories, directives, controllers, angRoute, angCookie, angularui, angularDialog, angulartics, angularGa, ngFileUpload) {
    'use strict';

    // Declare app level module which depends on filters, and services

    return angular.module('wishrhit', [
        'ngRoute',
        'ngCookies',
        'controllers',
        'filters',
        'services',
        'directives',
        'factories',
        'pascalprecht.translate',
        'ui.bootstrap',
        'dialogs.main',
        'ngAnimate',
        'angulartics',
        'angulartics.google.analytics',
        'ngFileUpload'
        // 'angular-loading-bar'


    ]).config(function($routeProvider, $locationProvider, $httpProvider, $analyticsProvider) {

        // $analyticsProvider.virtualPageviews(false);
        // console.clear();

        // $("input[name='X-XSRF-TOKEN']").val($cookieStore("XSRF-TOKEN"));
        $httpProvider.defaults.headers.common['X-XSRF-TOKEN'] = $("input[name='X-XSRF-TOKEN']").val();

        $httpProvider.interceptors.push('httpInterceptor');
        
    }).run(function(authService, $rootScope, $location, $http, $cookies, $route) {
       

        $rootScope.$on('$routeChangeStart', function(event, next, current) {});
        $rootScope.$on('$routeChangeSuccess', function(a, b, c) {

        });


    }).controller('MainCtrl', ['$scope', '$routeParams', '$http', '$filter', '$location', '$cacheFactory', '$route', '$translate', 'authService', '$cookies', 'tabHelper', 'util', 'reportWidget', '$rootScope', 'loginService',
        function($scope, $routeParams, $http, $filter, $location, $cacheFactory, $route, $translate, $authService, $cookies, $tabHelper, $util, $rpt, $rootScope, $loginService) {

            //Home Main Controller
    		$scope.footerDate = new Date(); //Every Year, Footer date will update automatically;
            $scope.loginUser = {
                username: "",
                password: "",
                unlockSpin: false,
                errorFlag: false,
                clickHere: false,
                loginDisable: false,
                isAdministerTest: false
            };


            $scope.sessionData = {
                warnFlag: false
            };

            $scope.showRepWidgToggle = function() {
                $rpt.showToggle();
            }

            $scope.warnClose = function() {
                $authService.warnClose($scope);
            }

            $scope.warnNo = function() {
                $authService.warnNo($scope);
            }

            $scope.warnYes = function() {
                $authService.warnYes($scope);
            }

            $rootScope.bigBoxCreated = 0;
            $scope.closeReportWidget = function() {
                $reportExportWidget.closeReportWidget();
            };


           
            $('#sessionLogoutDialog').removeClass('hidden');
            $scope.loadingFlag = true;

            // $rpt.init();

            $scope.core = {};
            $scope.csrf = $cookies.get('XSRF-TOKEN');
            $("input[name='X-XSRF-TOKEN']").val($cookies.get('XSRF-TOKEN'));

            $scope.login = function() {
                $loginService.login($scope);
            }
            $scope.loginClickHere = function() {
                $authService.loginClickHere($scope);
            }
            $scope.clearMessages1 = function() {
                $authService.clearMessages1($scope);
            }

            $scope.logout=function(){
                $authService.logout($scope);
            }

            $scope.traceIE = false;
            if (navigator.userAgent.indexOf('MSIE 9') > 0) {
                $scope.traceIE = true;
            }
            
            $scope.traceFirefox = false;
            if (navigator.userAgent.indexOf('Firefox/30.0') > 0) {
                $scope.traceFirefox = true;
            }
            $scope.loginEnter = function(keyEvent) {
                if (keyEvent.which === 13)
                    $scope.login();
            }


            $scope.reloadRoute = function() {
                $route.reload();
            };

            $scope.isLocation = function(path) {
                if ($location.url() == path)
                    return true;
                else
                    return false;
            };

            $loginService.initUser($scope);

            //Sticky Header
            $(window).scroll(function() {
                $tabHelper.addStickyHead();
            });


            $(window).resize(function() {
                $(".stickyHeader").remove();
                $tabHelper.addStickyHead();
            });

            // Tooltips Enabled
            if (!$util.isMobile())
                $('body').tooltip({
                    selector: "[data-original-title]",
                    'placement': 'bottom'
                });

            $scope.clearSessionError=function(){
                $('#sessionError').addClass('hidden');
                console.log("in");
            }

            $scope.showPasswordPage = function() {
                $location.url("changePassword");
            };

            if($scope.loginUser!=undefined && $scope.loginUser.username=='')
                    $scope.loginUser.clickHere=true;
            
        }
    ]);
});
