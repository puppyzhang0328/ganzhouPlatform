/**
 * basic.police.factory.js
 * @author: yumaotao
 * @create 2016-12-29 16:01
 */
(function () {
    angular.module('app.basicinfo')
        .factory('policeService', policeService);
    policeService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function policeService($http, URL_SEED) {
        var POLICE_URL = URL_SEED.API_URL + 'baseinfo/policeStation/';
        return {
            queryPolice:queryPolice,
            addPolice: addPolice,
            deletePolice:deletePolice,
            modifyPolice:modifyPolice,
            readRecords:readRecords
        };
        function queryPolice() {
            return $http({
                method: 'GET',
                url: POLICE_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function addPolice(stationCode,stationName,bureauid) {
            var police = angular.toJson({
                stationCode:stationCode,
                stationName:stationName,
                bureau:bureauid
            });
            return $http({
                method: 'POST',
                url: POLICE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: police,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deletePolice(id) {
            var police = angular.toJson({policeid: id});
            return $http({
                method: 'DELETE',
                url: POLICE_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: police,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyPolice(policeid,stationCode,stationName,bureauid) {
            var police = angular.toJson({
                policeid:policeid,
                stationCode:stationCode,
                stationName:stationName,
                bureau:bureauid
            });
            return $http({
                method: 'PUT',
                url: POLICE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: police,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect,a,b) {
            return $http({
                method: 'GET',
                url: POLICE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index:start_index,
                    pagedirect : pagedirect,
                    policeid:a,
                    bureauid:b,
                    max_results: 50
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();