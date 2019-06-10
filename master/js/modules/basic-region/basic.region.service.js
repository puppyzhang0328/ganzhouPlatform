(function () {
    angular.module('app.basicinfo')
        .factory('regionService', regionService);
    regionService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function regionService($http, URL_SEED) {
        var REGION_URL =  URL_SEED.API_URL + 'baseinfo/region/';
        return {
            queryRegion:queryRegion,
            addRegion: addRegion,
            deleteRegion:deleteRegion,
            modifyRegion:modifyRegion,
        　　readRecords:readRecords
        };
        //查询区域信息
        function queryRegion() {
            return $http({
                method: 'GET',
                url: REGION_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function addRegion(code,pcode,name,suffix,fullname,pinyin,py,level) {
            var region = angular.toJson({
                code: code,
                pcode: pcode,
                name: name,
                suffix: suffix,
                fullname: fullname,
                pinyin: pinyin,
                py:py,
                level:level
            });
            return $http({
                method: 'POST',
                url: REGION_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: region,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deleteRegion(id) {
            var region = angular.toJson({regionid: id});
            return $http({
                method: 'DELETE',
                url: REGION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: region,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyRegion(id,code,pcode,name,suffix,fullname,pinyin,py,level) {
            var region = angular.toJson({
                regionid:id,
                code: code,
                pcode: pcode,
                name: name,
                suffix: suffix,
                fullname: fullname,
                pinyin: pinyin,
                py:py,
                level:level
            });
            return $http({
                method: 'PUT',
                url: REGION_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: region,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect,id) {
            return $http({
                method: 'GET',
                url: REGION_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index:start_index,
                    pagedirect: pagedirect,
                    regionid:id
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

    }
})();