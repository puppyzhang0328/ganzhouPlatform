/**
 * basic.bureau.factory.js
 * @author: yumaotao
 * @create 2016-12-29 16:01
 */
(function () {
    angular.module('app.basicinfo')
        .factory('bureauService', bureauService);
    bureauService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function bureauService($http, URL_SEED) {
        var BUREAU_URL = URL_SEED.API_URL + 'baseinfo/bureau/';
        return {
            queryBureau:queryBureau,
            addBureau: addBureau,
            deleteBureau:deleteBureau,
            modifyBureau:modifyBureau,
            readRecords:readRecords
        };
        function queryBureau() {
            return $http({
                method: 'GET',
                url: BUREAU_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function addBureau(cityproperCode,cityproperName,region) {
            var bureau = angular.toJson({
                cityproperCode: cityproperCode,
                cityproperName: cityproperName,
                region:region
            });
            return $http({
                method: 'POST',
                url: BUREAU_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: bureau,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deleteBureau(id) {
            var bureau = angular.toJson({bureauid: id});
            return $http({
                method: 'DELETE',
                url: BUREAU_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: bureau,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyBureau(bureauid,cityproperCode,cityproperName,region) {
            var bureau = angular.toJson({
                bureauid:bureauid,
                cityproperCode: cityproperCode,
                cityproperName: cityproperName,
                region:region
            });
            return $http({
                method: 'PUT',
                url: BUREAU_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: bureau,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect,regionId,bureauId) {
            return $http({
                method: 'GET',
                url: BUREAU_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index:start_index,
                    pagedirect : pagedirect,
                    regionid:regionId,
                    bureauid:bureauId,
                    max_results: 50
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();