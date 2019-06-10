/**
 * Created by huangxiang  on 2018/12/13 0013.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    angular.module('app.unnormalbill')
        .service('unNormalBillServe',unNormalBillServe);

    unNormalBillServe.$inject = ['$http','URL_SEED'];

    'use strict';
    function unNormalBillServe($http, URL_SEED) {
        var self = this;
        var ONLINE_PAYMENT = URL_SEED.API_URL + 'billing/abnormalbill/';

        /*获取首页记录*/
        self.readRecords = function (start_index,pagetype,type,mintime,maxtime) {
            var params = {
                max_results:100,
                start_index:start_index,
                pagedirect:pagetype,
                type:type,//xxtx 表示湘行天下 yx 第三方异常账单 app APP异常账单
                mintime:mintime,
                maxtime:maxtime
            };
            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:params,
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                return response.data;
            });
        };
          //修改异常

        self.modifyNormal=function (type,bill_id,memo,thirdpay_checkstatus) {
            // var params = {
            //     type:type,//xxtx 表示湘行天下 yx 第三方异常账单 app APP异常账单
            //     bill_id : bill_id,
            //     memo:memo,
            //     thirdpay_checkstatus:thirdpay_checkstatus
            // };
            var params = angular.toJson({
                    type:type,//xxtx 表示湘行天下 yx 第三方异常账单 app APP异常账单
                    bill_id : bill_id,
                    memo:memo,
                    thirdpay_checkstatus:thirdpay_checkstatus
            });
            return $http({
                method :'PUT',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                data:params,
                withCredentials:true
            }).then(function(response){
                return response.data;
            });
        };

    }
})();