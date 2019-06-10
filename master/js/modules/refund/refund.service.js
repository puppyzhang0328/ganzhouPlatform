
/**
 * Created by huangxiang  on 2016/11/24 0024.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.refund')
        .service('OnlineRefundService',OnlineRefundService);

    OnlineRefundService.$inject = ['$http','URL_SEED'];

    'use strict';
    function OnlineRefundService($http, URL_SEED) {
        var self = this;
        var ONLINE_PAYMENT = URL_SEED.API_URL + 'approval/audit/';//查询账单
        var ONLIE_REFUND= URL_SEED.API_URL + 'billing/onlinerefund/';//详情账单


        /*获取退款查询记录*/
        self.readHome = function (record_id,state,created_time_min,created_time_max,start_index,pagedirect,username) {
            var refund='refund';
               var querydata={
                   audit_type:refund,//退款类型
                   record_id:record_id,//退款的id
                   state:state,//申请状态
                   created_time_min:created_time_min,//申请最小时间
                   created_time_max:created_time_max,//申请最大时间
                   start_index:start_index,//开始索引
                   max_results:50,//最大页面
                   pagedirect:pagedirect,//上一页下一页
                   username:username
               };

            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:querydata,
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            })


        };
         //查询所有的数据
        self.allrefund=function () {
            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    audit_type:'refund'
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            })
        };

        //确定退款
        self.refundSure=function (out_trade_no,refundfee,refund_id) {
            var querydata=angular.toJson({
                out_trade_no:out_trade_no,
                refundfee:refundfee,
                refund_id:refund_id
            });
              return $http({
                  method:'POST',
                  url:ONLIE_REFUND,
                  headers:{
                      'Content-Type':'application/json'
                  },
                  data:querydata,
                  withCredentials:true
                  // ignoreLoadingBar: true
              }).then(function (response) {
                  return response.data;
              })



        };
    }
})();