(function () {
    angular.module('app.basicinfo')
        .factory('townService', townService);
    townService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function townService($http, URL_SEED) {
        var TOWN_URL = URL_SEED.API_URL + 'baseinfo/towncentre/'
        return {
            queryTown:queryTown,
            addTown: addTown,
            deleteTown:deleteTown,
            modifyTown:modifyTown,
            readRecords:readRecords
        };
        function queryTown() {
            return $http({
                method: 'GET',
                url: TOWN_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function addTown(code,name,region) {
            var town = angular.toJson({
                code: code,
                name: name,
                regionid:region
            });
            return $http({
                method: 'POST',
                url: TOWN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: town,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deleteTown(id) {
            var town = angular.toJson({townid: id});
            return $http({
                method: 'DELETE',
                url: TOWN_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: town,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyTown(id,code,name,region) {
            var town = angular.toJson({
                townid:id,
                code: code,
                name: name,
                regionid:region
            });
            return $http({
                method: 'PUT',
                url: TOWN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: town,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect,a,b) {
            return $http({
                method: 'GET',
                url: TOWN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index:start_index,
                    pagedirect: pagedirect,
                    regionid:a,
                    twonid:b,
                    max_results: 50
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();