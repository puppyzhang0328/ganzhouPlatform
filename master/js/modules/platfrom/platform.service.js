/**
 * basic.Platform.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.basicinfo')
        .factory('platformService', platformService);
    platformService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function platformService($http, URL_SEED) {
        var PLATFORM_URL = URL_SEED.API_URL + 'join3rd/platefrom3rd/'
        var PLATFORM_POWER_URL = URL_SEED.API_URL + 'join3rd/dataObject/'
        return {
            queryPlatform:queryPlatform,
            addPlatform: addPlatform,
            deletePlatform:deletePlatform,
            modifyPlatform:modifyPlatform,
            modifyPlatformPower:modifyPlatformPower,
            queryPlatformPower:queryPlatformPower,
            readRecords:readRecords
        };
        function queryPlatform() {
            return $http({
                method: 'GET',
                url: PLATFORM_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function addPlatform(plateformname,username,loginurl,password,encrypt_passwd,dataurl,param1) {
            var platform = angular.toJson({
                    plateformname: plateformname,
                    username: username,
                    loginurl: loginurl,
                    password: password,
                    encrypt_passwd: encrypt_passwd,
                    dataurl: dataurl,
                    param1: param1
            });
            return $http({
                method: 'POST',
                url: PLATFORM_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: platform,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deletePlatform(id) {
            var platform = angular.toJson({plateformid: id});
            return $http({
                method: 'DELETE',
                url: PLATFORM_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: platform,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyPlatform(platformid,plateformname,username,loginurl,password,encrypt_passwd,dataurl,param1) {
            var platform = angular.toJson({
                platformid:platformid,
                plateformname: plateformname,
                username: username,
                loginurl: loginurl,
                password: password,
                encrypt_passwd: encrypt_passwd,
                dataurl: dataurl,
                param1: param1
            });
            return $http({
                method: 'PUT',
                url: PLATFORM_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: platform,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryPlatformPower(plateform) {
            return $http({
                method: 'GET',
                url: PLATFORM_POWER_URL,
                params: {
                    plateform: plateform,
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyPlatformPower(staffid, parklots) {
            var platformPower = angular.toJson({plateform: staffid,objidentifier: parklots});
            return $http({
                method: 'PUT',
                url: PLATFORM_POWER_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: platformPower,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect) {
            var readRecords = angular.toJson({
                start_index:start_index,
                pagedirect : pagedirect       // 组织名称
            });
            return $http({
                method: 'GET',
                url: PLATFORM_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: readRecords,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();