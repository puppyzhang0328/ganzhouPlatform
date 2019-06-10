(function () {
    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$localStorage', '$cookies'];

    'use strict';
    function settingsRun($rootScope, $localStorage, $cookies) {


        // User Settings
        // -----------------------------------
        $rootScope.user = {
            name: $cookies.get('userName'),
            job: $cookies.get('userPermission'),
            picture: 'app/img/user.png',
            organization_name:$cookies.get('organization_name'),
            nick_name:$cookies.get('nick_name')
        };

        // Hides/show user avatar on sidebar from any element
        $rootScope.toggleUserBlock = function () {
            $rootScope.$broadcast('toggleUserBlock');
        };

        // Global Settings
        // -----------------------------------
        $rootScope.app = {
            name: '奥肯特科技',
            description: '赣州直接停车产业开发有限公司 ',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false,
                theme: null,
                asideScrollbar: false,
                isCollapsedText: false
            },
            useFullLayout: false,
            hiddenFooter: false,
            offsidebarOpen: false,
            asideToggled: false,
            viewAnimation: 'ng-fadeInUp'
        };

        // Setup the layout mode
        $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h');

        // Restore layout settings [*** UNCOMMENT TO ENABLE ***]
        if (angular.isDefined($localStorage.layout))
            $rootScope.app.layout = $localStorage.layout;
        else
            $localStorage.layout = $rootScope.app.layout;

        $rootScope.$watch('app.layout', function () {
            $localStorage.layout = $rootScope.app.layout;
        }, true);

        // Close submenu when sidebar change from collapsed to normal
        $rootScope.$watch('app.layout.isCollapsed', function (newValue) {
            if (newValue === false)
                $rootScope.$broadcast('closeSidebarMenu');
        });

    }

})();
