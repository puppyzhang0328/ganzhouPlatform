/**
 * Created by huangxiang  on 2016/11/24 0024.
 * @author: huangxiang
 * Module: vehicle.in.service.js
 * feature: 停车入场记录与后台交互service
 */
(function () {
    angular.module('app.basicinfo')
        .service('CouponManService',CouponManService);
    CouponManService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function CouponManService($http, URL_SEED) {
        var self = this;
        var COUPONMAN_URL = URL_SEED.API_URL + 'operation/couponman/';
        /*获取首页记录*/
        self.readHome = function () {
            return $http({
                method: 'GET',
                url: COUPONMAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 100,
                    start_index: 0,
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
        self.readRecords = function (start_index, max_result, pagetype) {
            return $http({
                method: 'GET',
                url: COUPONMAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index: start_index,
                    max_results: max_result,
                    pagedirect: pagetype
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };

        /*获取尾页记录*/
        self.readLastPage = function () {
            return $http({
                method: 'GET',
                url: COUPONMAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: -1
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
    }
})();