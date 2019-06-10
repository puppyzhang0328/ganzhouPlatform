(function () {

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$animateProvider','toastrConfig'];

    'use strict';
    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider,toastrConfig) {

        var core = angular.module('app.core');
        // registering components after bootstrap
        core.controller = $controllerProvider.register;
        core.directive = $compileProvider.directive;
        core.filter = $filterProvider.register;
        core.factory = $provide.factory;
        core.service = $provide.service;
        core.constant = $provide.constant;
        core.value = $provide.value;

        // Disables animation on items with class .ng-no-animation
        $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);

        // Improve performance disabling debugging features
        // $compileProvider.debugInfoEnabled(false);

        angular.extend(toastrConfig, {
            autoDismiss: true,
            closeButton:true,
            containerId: 'toast-container',
            maxOpened: 0,
            progressBar:true,
            timeOut:5000,
            extendedTimeOut: 1000,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });

    }

})();