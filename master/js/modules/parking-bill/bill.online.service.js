/**
 * bill.online.service.js.js
 * @author: huangxiang
 * @create 2016-12-29 16:01
 */
(function () {
    angular.module('app.bill')
        .factory('OnlineBill', OnlineBill);

    OnlineBill.$inject = ['$http', 'URL_SEED'];
    'use strict';
    /**
     * @jsdoc function
     * @param $http
     * @param URL_SEED
     * @returns {{queryOnlineBill: queryOnlineBill, queryBillDetail: queryBillDetail, readHome: readHome, readLastPage: readLastPage}}
     * @constructor
     */
    function OnlineBill($http, URL_SEED) {

        var ONLINE_BIll_URL = URL_SEED.API_URL + 'billing/onlinebill/';

        var ACCOUNT_BALANCE_URL = URL_SEED.API_URL + 'operation/reconcile/';

        return {
            queryOnlineBill: queryOnlineBill,  // 查询线上缴费记录，根据参数确定是上一页还是下一页
            queryBillDetail: queryBillDetail, // 查询单个缴费记录详情
            readHome: readHome, // 查询首页缴费记录
            readLastPage: readLastPage, // 查询尾页缴费记录
            queryAccountBalance: queryAccountBalance // 查询对账单
        };

        /**
         * @jsdoc function 缴费账单与后台通信的service
         * @param max_result
         * @param pagetype
         * @param parking_lot_id
         * @param plate_number
         * @param start_index
         * @returns {*}
         */
        function queryOnlineBill(start_index, max_result, pagetype, parking_lot_id, plate_number) {
            return $http({
                method: 'GET',
                url: ONLINE_BIll_URL,
                params: {
                    querytype: 'all',
                    start_index: start_index,
                    max_results: max_result,
                    pagedirect: pagetype,
                    parking_lot_id: parking_lot_id,
                    plate_number: plate_number
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * @jsdoc 查询单条记录的详情
         * @param journalid 记录的id
         * @returns {*}
         */
        function queryBillDetail(journalid) {
            return $http({
                method: 'GET',
                url: ONLINE_BIll_URL,
                params: {
                    querytype: 'one',
                    journalid: journalid
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * @jsdoc function 查询首页缴费记录
         * @param parking_lot_id
         * @param plate_number
         * @returns {*}
         */
        function readHome(parking_lot_id, plate_number) {
            return $http({
                method: 'GET',
                url: ONLINE_BIll_URL,
                params: {
                    max_results: 50,
                    start_index: 0,
                    parking_lot_id: parking_lot_id,
                    plate_number: plate_number
                }
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         * @jsdoc function 查询尾页缴费记录
         * @param parking_lot_id
         * @param plate_number
         * @returns {*}
         */
        function readLastPage(parking_lot_id, plate_number) {
            return $http({
                method: 'GET',
                url: ONLINE_BIll_URL,
                params: {
                    max_results: 50,
                    start_index: -1,
                    parking_lot_id: parking_lot_id,
                    plate_number: plate_number
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        function queryAccountBalance(min_extime,max_extime,parklotid) {

            return $http({
                method: 'GET',
                url: ACCOUNT_BALANCE_URL,
                params:{
                    min_extime:min_extime,
                    max_extime:max_extime,
                    parklotids:parklotid
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

    }
})();