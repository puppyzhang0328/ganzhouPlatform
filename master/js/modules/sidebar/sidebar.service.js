(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http','logger','loadSidebarMenu'];

    function SidebarLoader($http,logger,loadSidebarMenu) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(onReady, onError) {

            // 根据不同的用户权限加载不同的菜单
            var menuJson = loadSidebarMenu.getMenuJson(),
            menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache

            // 一个菜单
            // var menuURL = 'server/sysadmin-sidebar.json' + '?v=' + (new Date().getTime()); // jumps cache

            onError = onError || function () {
                    logger.error('加载菜单失败','','当前用户可能未分配角色权限，请检查！');
                };

            $http
                .get(menuURL)
                .success(onReady)
                .error(onError);
        }
    }
})();