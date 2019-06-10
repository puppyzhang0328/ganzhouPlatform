/**
 * Created by huangxiang  on 2016/11/24 0024.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.prepayment')
        .service('OfflinePaymentService',OfflinePaymentService);

    OfflinePaymentService.$inject = ['$http','URL_SEED'];

    function OfflinePaymentService($http, URL_SEED) {
        var self = this;
        var ONLINE_PAYMENT = URL_SEED.API_URL + 'billing/offlinepay/';
        /*获取首页记录*/
        self.readHome = function (parking_lot_id,plate_number,valid_begintime,valid_endtime) {
            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    max_results:50,
                    start_index:0,
                    parking_lot_id:parking_lot_id,
                    plate_number:plate_number,
                    min_payment_time:valid_begintime,
                    max_payment_time:valid_endtime
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                console.log('停车入场记录=='+response.data);
                return response.data;
            });
        };

        self.readRecords = function (start_index, max_result, pagetype,parking_lot_id,plate_number,valid_begintime,valid_endtime) {
            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    max_results:max_result,
                    start_index:start_index,
                    pagedirect:pagetype,
                    parking_lot_id:parking_lot_id,
                    plate_number:plate_number,
                    min_payment_time:valid_begintime,
                    max_payment_time:valid_endtime
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                return response.data;
            });
        };

        /*获取尾页记录*/
        self.readLastPage = function (parking_lot_id,plate_number,valid_begintime,valid_endtime) {
            return $http({
                method: 'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    max_results:50,
                    start_index:-1,
                    parking_lot_id:parking_lot_id,
                    plate_number:plate_number,
                    min_payment_time:valid_begintime,
                    max_payment_time:valid_endtime
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                return response.data;
            });
        };
    }
})();