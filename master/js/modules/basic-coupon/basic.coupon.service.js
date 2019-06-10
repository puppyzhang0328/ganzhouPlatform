/**
 * bill.online.service.js.js
 * @author: huangxiang
 * @create 2016-12-29 16:01
 */
(function () {
    angular.module('app.basicinfo')
        .factory('couponService', couponService);
    couponService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function couponService($http, URL_SEED) {
        // var COUPON_URl =URL_SEED.API_URL+'';
        var COUPON_URL =URL_SEED.API_URL+'operation/couponmetaman/';
        return {
            queryCoupon:queryCoupon,//查询优惠券信息
            addCoupon: addCoupon,//新增优惠券信息
            deleteCoupon:deleteCoupon,//删除优惠券信息
            modifyCoupon:modifyCoupon,//修改优惠券信息
            readRecords:readRecords
        };
        //查询区域信息
        function queryCoupon() {
            return $http({
                method: 'GET',
                url: COUPON_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //新增区域信息
        function addCoupon(campaign,campaign_displayname,denomination,num_per_user,total,valid_begintime,valid_endtime,coupon_valid_begintime,coupon_valid_endtime,isvalid,usemode) {
            var coupon = angular.toJson({
                campaign:campaign,
                campaign_displayname:campaign_displayname,
                denomination:denomination,
                num_per_user:num_per_user,
                total:total,
                valid_begintime:valid_begintime,
                valid_endtime:valid_endtime,
                coupon_valid_begintime:coupon_valid_begintime,
                coupon_valid_endtime:coupon_valid_endtime,
                isvalid:isvalid,
                usemode:usemode
            });
            return $http({
                method: 'POST',
                url: COUPON_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: coupon,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //删除区域信息
        function deleteCoupon(id) {
            var coupon = angular.toJson({id: id});
            return $http({
                method: 'DELETE',
                url: COUPON_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: coupon,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //修改区域信息
        function modifyCoupon(id,isvalid) {
            var coupon = angular.toJson({
                couponmetaid:id,
                isvalid:isvalid
            });
            return $http({
                method: 'PUT',
                url: COUPON_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: coupon,
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
                url: COUPON_URL,
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