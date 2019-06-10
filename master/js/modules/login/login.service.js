/**
 * Created by huangxiang on 2016/11/21 0021.
 */
(function () {
    angular.module('app.login')
        .factory('AuthorizationFactory', AuthorizationFactory);

    AuthorizationFactory.$inject = ['Base64', '$http', '$cookieStore', '$rootScope', 'URL_SEED', 'md5','logger'];

    'use strict';
    /**
     * @jsdoc function
     * @param Base64
     * @param $http
     * @param $cookieStore
     * @param $rootScope
     * @param URL_SEED
     * @param md5
     * @param logger
 * @returns {{login: login, SetCredentials: SetCredentials, ClearCredentials: ClearCredentials}}
     * @constructor
     */
    function AuthorizationFactory(Base64, $http, $cookieStore, $rootScope, URL_SEED, md5,logger) {
        var LOGIN_URL = URL_SEED.API_URL + 'account/login/';
        return {
            login: login,
            SetCredentials: SetCredentials,
            ClearCredentials: ClearCredentials
        };
        /**v
         * 用户登录
         * @param username 用户名
         * @param password 密码
         * @param callback 结果回调
         */
        function login(username, password, callback) {
            // // 使用用户名进行MD5，32位，作为key
            var key_str = md5.createHash(username);
            // // 将key转换成128 bit
            var key = CryptoJS.enc.Utf8.parse(key_str);
            //
            // // 对password进行AES加密
            var AESPass = CryptoJS.AES.encrypt(password, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            //
            // // CryptoJS 的 encrypt函数不会直接返回字符串，需要toString或者Crypto-JS进行转码才能得到真实的结果。
            var pass = AESPass.toString();

            var authData = Base64.encode(username + ':' + pass).replace(/[\r\n]/g, '');
            // console.log(authData);
            $http({
                method: 'GET',
                url: LOGIN_URL,
                headers: {
                    'Authorization': 'Basic ' + authData
                }
            }).success(function (response) {
                callback(response);
            }).error(function (response) {
                logger.error('登陆失败',response.detail,'请检查账号密码是否正确输入!');
            });
        }

        /**
         * 设置cookies和全局globals
         * @param username
         * @param password
         * @constructor
         */
        function SetCredentials(username, password) {
            var authData = Base64.encode(username + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authData: authData
                }
            };
            $cookieStore.put('globals', $rootScope.globals);
        }

        /**
         * 清除全局globals
         * @constructor
         */
        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
        }
    }
})();