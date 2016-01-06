define(['angular', 'services'], function(angular) {
    'use strict';

    /* Services */


    angular.module('factories', [])
        .factory('session', ['$cookies', function($cookies) {
            // read Play session cookie
            var rawCookie = $cookies.get('PLAY_SESSION');
            var rawData = rawCookie.substring(rawCookie.indexOf('-') + 1, rawCookie.length - 1);
            var session = {};
            _.each(rawData.split("&"), function(rawPair) {
                var pair = rawPair.split('=');
                session[pair[0]] = pair[1];
            });
            return session;
        }]).factory('httpInterceptor', function($q, authService, $location) {
            return {
                // optional method
                'request': function(config) {
                    var url, loadHiding;

                    url = config.url;
                    url = url.substr(0, 12);
                    // url = $location.path();
                    loadHiding = 0;
                    if( !url.startsWith("/api") ) {
                    	config.withCredentials = true;
                    }
                    if (config.method == 'GET') {
                        loadHiding = loadHiding + 1;
                    } else if (url == '/api/reports') {
                        loadHiding = loadHiding + 1;
                    }

                    // console.log(url+'-'+url.indexOf('api'));
                    if (url.indexOf('api') > 0)
                        if (config.url != '/api/getCore' && config.url != '/api/firstLogin') {
                            // console.log("calling URL=" + url);
                            authService.isLoggedIn();
                        }

                    if ($('.modal-dialog').parent().hasClass('in')) {
                        loadHiding = loadHiding + 1;
                    } else {
                         $('.modal-backdrop').remove();
                    }

                    if (loadHiding == 0) {
                        //console.log("enable loading");
                        $('#overlay').css('display', 'block');
                        $('#cover').css('display', 'block');
                        $('.norecords').css('display', 'none');
                        $(document).scrollTop(0);
                        loadHiding = 0;
                    }
                    return config;
                },

                // optional method
                'requestError': function(rejection) {
                    
                    //timeoutService.touch()
                    $('#spinner').removeClass("fa-spin");
                    $('#overlay').css('display', 'none');
                    $('#cover').css('display', 'none');

                    $('.norecords').css('display', 'block');
                    $(document).scrollTop(0);
                   

                    return $q.reject(rejection);
                    
                },

                // optional method
                'response': function(response) {
                    $('#overlay').css('display', 'none');
                    $('#cover').css('display', 'none');
                    $('.norecords').css('display', 'block');
                    $(document).scrollTop(0);
                    return response;
                },

                // optional method
                'responseError': function(rejection) {
                    if (rejection.status != 200) {
                        $('#overlay').css('display', 'none');
                        $('#cover').css('display', 'none');
                        $('.norecords').css('display', 'block');
                        $(document).scrollTop(0);
                        console.log('sttaus='+rejection.status);
                     var msg='';
                    switch(rejection.status){
                        // case 400: msg='Server recived a bad request, if the problem continues please contact Technical support team.';
                        //             break;
                        // case 401: msg='You are not authrized to perform this operation.';
                        //             break;
                        // case 403: msg='You are not authrized to perform this operation.';
                        //             break;
                        // case 500:msg='Server is unable to process your request at this moment. If the problem continues please contact Technical support team. ';
                        //             break;
                        case 503:msg='Connection to the server is lost. Please try again at a later time.';
                                    break;
                        case 0:msg='Connection to the server is lost. Please try again at a later time.';
                                    break;
                        // default:msg='Server is unable to process your request at this moment. If the problem continues please contact Technical support team. ';
                        //             break;                                    
                    }

                    if(msg!='' && $('.SmallBox').length<1)
                    $.smallBox({
                            title: "<i class='fa fa-bell'> <b>&nbsp;Alert!</b></i>",
                            content: "<i>" + msg + "</i>",
                            color: "",
                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                            timeout: 5000
                        
                        });
                    }
                    // do something on error
                    // if (canRecover(rejection)) {
                    //   return responseOrNewPromise
                    // }
                    return $q.reject(rejection);
                }
            };
        });
});
