/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
(function () {

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
            'desktopLG': 1200,
            'desktop': 992,
            'tablet': 768,
            'mobile': 480
        })
    ;

})();