(function () {
    angular.module('app.collector')
        .factory('CollectorManageFactory', CollectorManageFactory);
    CollectorManageFactory.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function CollectorManageFactory($http, URL_SEED) {

        var OPERATOR_URL = URL_SEED.API_URL + 'operation/charge_app/conf/'; // 查询所有用户
        var AVAILABLE_PARK_URL = URL_SEED.API_URL + 'operation/charge_app/parking/';
        var HAS_BIND_PHONE_URL = URL_SEED.API_URL + 'operation/charge_app/user_search/';
        var PARKLOTS_URL = URL_SEED.API_URL + 'operation/charge_app/parking/'; // 查询停车场
        var currentClickUser = {
            userid: 0,
            username: ''
        };

        return {
            readAll: readAll,
            addCollector: addCollector,
            readOneCollector: readOneCollector,
            modifyCollector: modifyCollector,
            deleteCollector: deleteCollector,
            queryAvailableParks: queryAvailableParks,
            setUserId: setUserId,
            getUserId: getUserId,
            setUsername: setUsername,
            getUsername: getUsername,
            hasBindPhone: hasBindPhone,
            queryParklots: queryParklots,
            parklotConfigUpdate: parklotConfigUpdate
        };
        
        function parklotConfigUpdate(params){
            return $http({
                method: 'POST',
                url: PARKLOTS_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: angular.toJson(params),
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryParklots(data) {
            // console.log(data)
            var _params = {}
            if(data.id){
                _params = {
                    id: data.id,
                }
            }else{
                _params = {
                    start_index: data.start_index,
                    pagedirect: data.pagedirect,
                    max_results: data.max_results ||50,
                }
            }
            return $http({
                method: 'GET',
                url: PARKLOTS_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params:_params,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }


        function hasBindPhone(username){
            return $http({
                method: 'GET',
                url: HAS_BIND_PHONE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {username: username},
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        // /*查询单个操作员*/
        function readOneCollector(staffid) {
            return $http({
                method: 'GET',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {staffid: staffid},
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        function queryAvailableParks(staffid) {
            return $http({
                method: 'GET',
                url: AVAILABLE_PARK_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {staffid: staffid},
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*查询所有的操作员*/
        function readAll(data) {
            // console.log(data)
            var _params = {}
            if(data){
                _params = {
                    start_index: data.start_index,
                    pagedirect: data.pagedirect,
                    staffid: data.staffid,
                    max_results: 50,
                }
            }
            return $http({
                method: 'GET',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params:_params,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*新增操作员*/
        function addCollector(collector) {
            var collectorJson = angular.toJson(collector);
            console.log(collectorJson)
            return $http({
                method: 'POST',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: collectorJson,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*修改操作员*/
        function modifyCollector(_params) {
            var collectorJson = angular.toJson({
                staffid: _params.id,
                first_name: _params.first_name,
                last_name: _params.last_name,
                email: _params.email,
                parklots: _params.parklots
            });
            return $http({
                method: 'PUT',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: collectorJson,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*删除操作员*/
        function deleteCollector(collector) {
            var collectorJSON = angular.toJson({staffid: collector});
            return $http({
                method: 'DELETE',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: collectorJSON,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        function setUserId(currentId) {
            currentClickUser.userid = currentId;
        }

        function getUserId() {
            return currentClickUser.userid;
        }

        function setUsername(currentName) {
            currentClickUser.username = currentName;
        }

        function getUsername() {
            return currentClickUser.username;
        }
    }
})();
