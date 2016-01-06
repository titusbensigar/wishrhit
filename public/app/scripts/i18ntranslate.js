define(['angular', 'app','angularTranslate'], function(angular, app,angularTranslate) {
    'use strict';

    return app.config(['$translateProvider',function ($translateProvider) {
    // register translation table

    //This is the default language
    $translateProvider.translations('en-us',{
        'login.title':'WishRHit',
        'username.required': 'Username Required',
        'password.required': 'Password Required',
        'email.required': 'Email Required',
        'fullname.required': 'Full name Required',
        'users.unknown.error': 'Unknown Error occured',
        'user.permanentLock.msg': 'User account locked'
    });

    $translateProvider.translations('es', {
        'app.name':'WishRHit',
        'username.required': 'Username Required',
        'password.required': 'Password Required',
        'email.required': 'Email Required',
        'fullname.required': 'Full name Required',
        'users.unknown.error': 'Unknown Error occured',
        'user.permanentLock.msg': 'User account locked'
        

      });

    var language = window.navigator.userLanguage || window.navigator.language;
    //console.log(language);

    //Try and use the provided language, otherwise use default.
    try {
        $translateProvider.preferredLanguage(en-us);
      } catch (e) {
        if(console && console.warn){
          // console.warn('No language configured for '+language+'. Using default language bundle.');
        }

        $translateProvider.preferredLanguage('en-us');
      }

  }]);
});
