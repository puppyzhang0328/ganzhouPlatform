/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.user-group')
        .factory('RolesManageService', RolesManageService);

    RolesManageService.$inject = ['$http', 'URL_SEED'];

    'use strict';
    function RolesManageService($http, URL_SEED) {
        var ROLE_URL = URL_SEED.API_URL + 'account/role/';

        var currentRole = {
            groupid: 0,
            groupname: ''
        };

        return {
            queryOneRole: queryOneRole,
            queryAllRole: queryAllRole,
            addRole: addRole,
            modifyRole: modifyRole,
            deleteRole: deleteRole,
            setCurrentRole: setCurrentRole,
            getCurrentRole: getCurrentRole
        };

        /*查询单个群组*/
        function queryOneRole(groupId) {
            return $http({
                method: 'GET',
                url: ROLE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {groupId: groupId},
                ignoreLoadingBar: true,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*查询所有群组*/
        function queryAllRole() {
            return $http({
                method: 'GET',
                url: ROLE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                ignoreLoadingBar: true,
                cache: true,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*新增群组*/
        function addRole(groupname) {
            var operatorJson = angular.toJson({groupname: groupname});
            return $http({
                method: 'POST',
                url: ROLE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: operatorJson,
                ignoreLoadingBar: true,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        }

        /*修改群组*/
        function modifyRole(operator, role, description, parking_lots) {
            var operatorJson = angular.toJson({
                operator_name: operator,
                role: role,
                description: description,
                parking_lots: parking_lots
            });
            return $http({
                method: 'PUT',
                url: ROLE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: operatorJson,
                ignoreLoadingBar: true,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /*删除群组*/
        function deleteRole(groupId) {
            var operatorJSON = angular.toJson({groupId: groupId});
            return $http({
                method: 'DELETE',
                url: ROLE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: operatorJSON,
                ignoreLoadingBar: true,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        function setCurrentRole(role) {
            currentRole.groupid = role.groupid;
            currentRole.groupname = role.groupname;
        }

        function getCurrentRole() {
            return currentRole;
        }
    }
})();