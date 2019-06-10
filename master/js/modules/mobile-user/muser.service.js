/**
 * Created by huangxiang  on 2016/12/1 0001.
 * @author: huangxiang
 * Module: muser.service.js
 * feature: 查询手机APP端注册用户信息
 */
(function () {
    angular.module('app.mobile-user')
        .factory('Mobile_User', Mobile_User);

    Mobile_User.$inject = ['$http', 'URL_SEED'];

    'use strict';
    function Mobile_User($http, URL_SEED) {
        var APP_USER_URL = URL_SEED.API_URL + 'user'; // 获取APP用户列表API, allow: GET
        var APP_USER_COMMENT = URL_SEED.API_URL + 'user/comment/'; // 用户反馈建议API, allow: GET/POST
        return {
            queryHome: queryHome,
            queryMobileUser: queryMobileUser,
            queryLast: queryLast,
            queryUserComment: queryUserComment,
            ReplyUserComment: ReplyUserComment
        };
        /**
         * 查询首页
         * @returns {*}
         */
        function queryHome(a,b,min_time,max_time) {
            return $http({
                method: 'GET',
                url: APP_USER_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: 0,
                    phone_number:b,
                    username:a,
                    min_time:min_time,
                    max_time:max_time
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * 查询上下页
         * @param start_index 起始id
         * @param max_result 最大允许条目数
         * @param pagedirect 0 上一页  1下一页
         * @returns {*}
         */
        function queryMobileUser(start_index, max_result, pagedirect,min_time,max_time) {
            return $http({
                method: 'GET',
                url: APP_USER_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index: start_index,
                    max_results: max_result,
                    pagedirect: pagedirect,
                    min_time:min_time,
                    max_time:max_time
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * 查询尾页
         * @returns {*}
         */
        function queryLast(min_time,max_time) {
            return $http({
                method: 'GET',
                url: APP_USER_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: -1,
                    min_time:min_time,
                    max_time:max_time
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * 查询APP用户建议反馈
         * @returns {*}
         */
        function queryUserComment() {
            return $http({
                method: 'GET',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * 回复APP用户建议反馈
         * @returns {*}
         * @constructor
         */
        function ReplyUserComment() {
            return $http({
                method: 'POST',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();