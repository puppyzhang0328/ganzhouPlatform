/**
 * Created by huangxiang  on 2016/12/1 0001.
 * @author: huangxiang
 * Module: muser.service.js
 * feature: 查询手机APP端注册用户信息
 */
(function () {
    angular.module('app.mobile-user')
        .factory('commentUser', commentUser);
    commentUser.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function commentUser($http, URL_SEED) {
        var APP_USER_COMMENT = URL_SEED.API_URL + 'user/comment/'; // 用户反馈建议API, allow: GET/POST
        return {
            queryHome: queryHome,
            queryComentUser: queryComentUser,
            queryLast: queryLast,
            ReplyUserComment: ReplyUserComment,
            queryUserComment:queryUserComment
        };
        function queryHome(a,b,c) {
            return $http({
                method: 'GET',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: 0,
                    startime:b,
                    endtime:c,
                    phone_number:a
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryComentUser(start_index, max_result, pagedirect) {
            return $http({
                method: 'GET',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index: start_index,
                    max_results: max_result,
                    pagedirect: pagedirect
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryLast() {
            return $http({
                method: 'GET',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: -1
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
        function ReplyUserComment(answersid,comments) {
            var userReply = angular.toJson({
                answersid: answersid,
                comments: comments,
            });
            return $http({
                method: 'POST',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-type': 'application/json'
                },
                data: userReply,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryUserComment(id){
            return $http({
                method: 'GET',
                url: APP_USER_COMMENT,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    objid: id,
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();