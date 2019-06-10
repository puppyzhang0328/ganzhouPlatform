/**
 * bill.online.service.js.js
 * @author: huangxiang
 * @create 2016-12-29 16:01
 */
(function () {
    angular.module('app.basicinfo')
        .factory('busTypeService', busTypeService);
    busTypeService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function busTypeService($http, URL_SEED) {
        // var ACCOUNT_BALANCE_URL = URL_SEED.API_URL + 'operation/reconcile/';
        var BUSTYPE_URL = URL_SEED.API_URL + 'baseinfo/businesstype/'
        return {
            queryBusType:queryBusType,
            addBusType: addBusType,
            deleteBusType:deleteBusType,
            modifyBusType:modifyBusType,
            readRecords:readRecords
        };
        function queryBusType() {
            return $http({
                method: 'GET',
                url: BUSTYPE_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function addBusType(genrecode,genrename) {
            var busType = angular.toJson({
                genrecode: genrecode,
                genrename:genrename
            });
            return $http({
                method: 'POST',
                url: BUSTYPE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: busType,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deleteBusType(id) {
            var busType = angular.toJson({businid: id});
            return $http({
                method: 'DELETE',
                url: BUSTYPE_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: busType,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyBusType(id,genrecode,genrename) {
            var busType = angular.toJson({
                businid:id,
                genrecode: genrecode,
                genrename: genrename
            });
            return $http({
                method: 'PUT',
                url: BUSTYPE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: busType,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect,bustypeId) {
            return $http({
                method: 'GET',
                url: BUSTYPE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index:start_index,
                    pagedirect : pagedirect,
                    businid:bustypeId
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();