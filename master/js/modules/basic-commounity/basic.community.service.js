(function () {
    angular.module('app.basicinfo')
        .factory('communityService', communityService);
    communityService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function communityService($http, URL_SEED) {
        var COMMUNITY_URL = URL_SEED.API_URL + 'baseinfo/community/'
        return {
            queryCommunity:queryCommunity,
            addCommunity: addCommunity,
            deleteCommunity:deleteCommunity,
            modifyCommunity:modifyCommunity,
            readRecords:readRecords
        };
        //查询区域信息
        function queryCommunity() {
            return $http({
                method: 'GET',
                url: COMMUNITY_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //新增区域信息
        function addCommunity(code,name,policeStation) {
            var Community = angular.toJson({
                code: code,
                name:name,
                policeStation:policeStation
            });
            return $http({
                method: 'POST',
                url: COMMUNITY_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: Community,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //删除区域信息
        function deleteCommunity(commid) {
            var Community = angular.toJson({commid: commid});
            return $http({
                method: 'DELETE',
                url: COMMUNITY_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: Community,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //修改区域信息
        function modifyCommunity(commid,code,name,policeStation) {
            var Community = angular.toJson({
                commid:commid,
                code: code,
                name: name,
                policeStation:policeStation
            });
            return $http({
                method: 'PUT',
                url: COMMUNITY_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: Community,
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
                url: COMMUNITY_URL,
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