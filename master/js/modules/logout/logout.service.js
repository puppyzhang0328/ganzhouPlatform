/**
 * Created by huangxiang  on 2016/11/22 0022.
 * @author: huangxiang
 * Module: logout.service.js
 * feature: 请求服务器
 */
(function () {
    angular.module('app.logout')
        .factory('LogoutFactory', LogoutFactory);

    LogoutFactory.$inject = ['$http', 'URL_SEED'];

    'use strict';
    /**
     *
     * @param $http
     * @param URL_SEED
     * @returns {{logout: logout}}
     * @constructor
     */
    function LogoutFactory($http, URL_SEED) {
        var LOGOUT_URL = URL_SEED.API_URL + 'account/logout/'; // URL
        return {
            logout: logout
        };

        /**
         * 退出登录
         * @param callback
         */
        function logout(callback) {
            $http({
                method: 'POST',
                url: LOGOUT_URL,
                withCredentials: true
            }).then(function (response) {
                callback(response);
            });
        }
    }
})();