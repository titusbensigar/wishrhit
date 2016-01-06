require.config({
	paths: {
		angular: '../bower_components/angular/angular.min',
		angularAnimate: '../bower_components/angular-animate/angular-animate.min',
		angularCookies: '../bower_components/angular-cookies/angular-cookies.min',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		angularResource: '../bower_components/angular-resource/angular-resource.min',
		angularRoute: '../bower_components/angular-route/angular-route.min',
		angularSanitize: '../bower_components/angular-sanitize/angular-sanitize.min',
		angularScenario: '../bower_components/angular-scenario/angular-scenario',
		angularTouch: '../bower_components/angular-touch/angular-touch.min',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
		jquery: '../bower_components/jquery/dist/jquery.min',
		jqueryui: '../bower_components/jqueryui/jquery-ui.min',
		autofil: '../bower_components/autofill-event/src/autofill-event',
		'ngFileUploadShim': '../bower_components/ng-file-upload/ng-file-upload-shim.min',   
	    'ngFileUpload': '../bower_components/ng-file-upload/ng-file-upload.min',
		'angular-animate': '../bower_components/angular-animate/angular-animate.min',
		'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
		'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
		'angular-resource': '../bower_components/angular-resource/angular-resource.min',
		'angular-route': '../bower_components/angular-route/angular-route.min',
		'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
		'angular-scenario': '../bower_components/angular-scenario/angular-scenario',
		'angular-touch': '../bower_components/angular-touch/angular-touch.min',
		'jqplot-bower': '../bower_components/jqplot-bower/dist/jquery.jqplot.min'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		angularRoute: [
			'angular'
		],
		jquery: {
			exports: 'jquery'
		},
		bootstrap: [
			'jquery',
			'jqueryui'
		],
		jqueryui: [
			'jquery'
		],
		jqvalidate: [
			'jquery'
		],
		ui: [
			'bootstrap'
		],
		jarvismenuext: [
			'jquery'
		],
		footable: [
			'jquery'
		],
		footable_paginate: [
			'footable'
		],
		date: [
			'jquery',
			'moment'
		],
		smartnote: [
			'jquery'
		],
		ajaxfileupload: [
			'jQueryNew'
		],
		angularSanitize: [
			'angular'
		],
		angularui: [
			'angular',
			'angularSanitize'
		],
		angularDialog: [
			'angularui',
			'angularDialogTranslate'
		],
		angularAnimate: [
			'angular'
		],
		angulartics: [
			'angular'
		],
		angularGa: [
			'angular',
			'angulartics'
		],
		angularTranslate: [
			'angular'
		],
		angularCookies: [
			'angular'
		],
		jqplot: [
			'jqplotcore'
		],
		jqplotcore: [
			'jquery'
		],
		touchpunch: [
			'jquery',
			'jqueryui'
		],
	    ngFileUploadShim : [ 
	         'angular' 
		],
		ngFileUpload : [
		    'ngFileUploadShim', 
		    'angular' 
		]
	},
	waitSeconds: 0,
	priority: [
		'angular'
	],
	jqplot: [
		'jqplotcore'
	],
	jqplotcore: [
		'jquery'
	],
	packages: [

	]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'jquery',
	'angular',
	'bootstrap',
	'ui',
	'jarvismenuext',
	'app',
	'routes',
	'i18ntranslate',
	'smartnote',
	'angularSanitize',
	'angularRoute',
	'angularAnimate',
	'angulartics',
	'angularGa',
	'jqueryui'
	

], function(jquery, angular, bootstrap, ui, jarvismenuext, app, routes, i18ntranslate, jqueryui) {
	'use strict';
	
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});

});