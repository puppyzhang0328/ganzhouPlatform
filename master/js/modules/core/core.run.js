(function () {

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', 'Colors', '$cookieStore', '$location', '$document'];

    'use strict';
    function appRun($rootScope, $state, $stateParams, $window, Colors, $cookieStore, $location, $document) {

        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;

        // 显示加载条
        $rootScope.showLoadingBar = true;
        // Uncomment this to disable template cache
        /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
         if (typeof(toState) !== 'undefined'){
         $templateCache.remove(toState.templateUrl);
         }
         });*/

        // $rootScope.$on('$stateChangeStart',function (event, toState, toStateParams) {
        //     // 跟踪用户想要去的state
        //     // authorization factory需要知道这些state
        //     $rootScope.toState = toState;
        //     $rootScope.toStateParams = toStateParams;
        //
        //
        //     if(principal.isIdentityResolved()){
        //         authorization.authorize();
        //     }
        // });

        // Allows to use branding color with interpolation
        // {{ colorByName('primary') }}
        $rootScope.colorByName = Colors.byName;

        // cancel click event easily
        $rootScope.cancel = function ($event) {
            $event.stopPropagation();
        };

        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            // $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authData; // jshint ignore:line
        }
        // console.log($cookies.csrftoken);
        //
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/page/login' && !$rootScope.globals.currentUser) {
                // $location.path('/page/login');
            }
        });


        // Hooks Example
        // -----------------------------------

        // Hook not found
        $rootScope.$on('$stateNotFound',
            function (event, unfoundState/*, fromState, fromParams*/) {
                console.log(unfoundState.to); // "lazy.state"
                console.log(unfoundState.toParams); // {a:1, b:2}
                console.log(unfoundState.options); // {inherit:false} + default options
            });
        // Hook error
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                $rootScope.showLoadingBar = false;
                console.log(error);
            });
        // Hook success
        $rootScope.$on('$stateChangeSuccess',
            function (/*event, toState, toParams, fromState, fromParams*/) {
                // display new view from top
                $window.scrollTo(0, 0);
                // Save the route title
                $rootScope.currTitle = $state.current.title;
                $rootScope.showLoadingBar = false;
            });

        // Load a title dynamically
        $rootScope.currTitle = $state.current.title;
        $rootScope.pageTitle = function () {
            var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
            $document.title = title;
            return title;
        };

    }

})();

