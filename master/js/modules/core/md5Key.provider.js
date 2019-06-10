/**
 * md5Key.provider.js
 * @author: huangxiang
 * @create 2017-01-12 15:20
 */
(function () {
    angular.module('app.core')
        .factory('MD5key', MD5key);
    'use strict';
    function MD5key() {

        var md5Key = '';

        return {
            setMD5Key: setMD5Key,
            getMD5Key: getMD5Key
        };


        function setMD5Key(key) {
            md5Key = key;
        }

        function getMD5Key() {
            return md5Key;
        }
    }
})();