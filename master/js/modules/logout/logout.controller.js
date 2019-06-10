/**
 * Created by huangxiang  on 2016/11/22 0022.
 * @author:huangxiang
 * Module: logout.controller.js
 * feature: 用户登出
 */
(function () {
    angular.module('app.logout')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$location', 'LogoutFactory', '$cookies', '$cookieStore', 'AuthorizationFactory'];

    'use strict';
    /**
     *
     * @param $location
     * @param LogoutFactory
     * @param $cookies
     * @param $cookieStore
     * @param AuthorizationFactory
     * @returns {{logout: logout}}
     * @constructor
     */
    function LogoutController($location, LogoutFactory, $cookies, $cookieStore, AuthorizationFactory) {

        return {
            logout: logout
        };

        /**
         * 退出登录
         */
        function logout() {
            LogoutFactory.logout(function (response) {
                if (response.data.status == 0) {
                    $cookies.remove('globals');
                    $cookies.remove('userName');
                    $cookies.remove('userPermission');
                    $cookies.remove('nick_name');
                    $cookies.remove('organization_name');
                    AuthorizationFactory.ClearCredentials();
                    $location.path('page/login');
                } else {
                    alert('退出失败!请检查服务器问题。');
                }
            });
        }
    }
})();