(function () {
    angular.module('app.operator')
        .factory('OperatorManageFactory', OperatorManageFactory);
    OperatorManageFactory.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function OperatorManageFactory($http, URL_SEED) {

        var OPERATOR_URL = URL_SEED.API_URL + 'account/operator/';
        var ROLE_URL = URL_SEED.API_URL + 'account/role/'; // 查询群组的url
        var PERMISSION_URL = URL_SEED.API_URL + 'account/backperm/'; // 查询所有权限的url

        var currentClickUser = {
            userid: 0,
            username: ''
        };

        return {
            readOneOperator: readOneOperator,
            readAll: readAll,
            readAllWithGroup: readAllWithGroup,
            addOperator: addOperator,
            modifyOperator: modifyOperator,
            deleteOperator: deleteOperator,
            queryRoleList: queryRoleList,
            queryPermissions: queryPermissions,
            setUserId: setUserId,
            getUserId: getUserId,
            setUsername: setUsername,
            getUsername: getUsername
        };

        /*查询单个操作员*/
        function readOneOperator(staffid) {
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

        /*查询所有的操作员*/
        function readAll() {

            return $http({
                method: 'GET',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*查询所有的操作员*/
        function readAllWithGroup(groupname) {

            return $http({
                method: 'GET',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    groupname: groupname
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*新增操作员*/
        function addOperator(operator,nickname,organization, role) {
            var operatorJson = angular.toJson({staffname: operator, password: role,nick_name:nickname,organization:organization});
            return $http({
                method: 'POST',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: operatorJson,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        }

        /*修改操作员*/
        function modifyOperator(staffid, groups, perms, parklots) {
            var operatorJson = angular.toJson({staffid: staffid, groups: groups, perms: perms, parklots: parklots});
            return $http({
                method: 'PUT',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: operatorJson,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*删除操作员*/
        function deleteOperator(operator) {
            var operatorJSON = angular.toJson({staffid: operator});
            return $http({
                method: 'DELETE',
                url: OPERATOR_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: operatorJSON,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*查询所有群组*/
        function queryRoleList() {
            return $http({
                method: 'GET',
                url: ROLE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*查询所有可分配权限*/
        function queryPermissions() {
            return $http({
                method: 'GET',
                url: PERMISSION_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
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
