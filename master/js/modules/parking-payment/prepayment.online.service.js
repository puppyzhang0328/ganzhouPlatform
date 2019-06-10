/**
 * Created by huangxiang  on 2016/11/24 0024.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.prepayment')
        .service('OnlinePaymentService',OnlinePaymentService);

    OnlinePaymentService.$inject = ['$http','URL_SEED'];

    'use strict';
    function OnlinePaymentService($http, URL_SEED) {
        var self = this;
        var ONLINE_PAYMENT = URL_SEED.API_URL + 'billing/onlinebill/';

        /*获取首页记录*/
        self.readHome = function (servicetype,payment_channel,username,paid,min_created_time,max_created_time,b) {
            var d=[];var c ='';
            if(b){
                d[0] = b;
                c = angular.toJson(d);
            }
            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    max_results:50,
                    start_index:0,
                    servicetype:servicetype,
                    payment_channel:payment_channel,
                    paid:paid,
                    username:username,
                    min_created_time:min_created_time,
                    max_created_time:max_created_time,
                    plate_number:c
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                return response.data;
            });
        };
        self.readRecords = function (start_index,max_results, pagetype,servicetype,payment_channel,username,paid,min_created_time,max_created_time,b) {
            var d=[];var c ='';
            if(b){
                d[0] = b;
                c = angular.toJson(d);
            }
            var params = {
                    max_results:50,
                    start_index:start_index,
                    pagedirect:pagetype,
                    servicetype:servicetype,
                    payment_channel:payment_channel,
                    paid:paid,
                    username:username,
                    min_created_time:min_created_time,
                    max_created_time:max_created_time,
                    plate_number:c
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

        /*获取尾页记录*/
        self.readLastPage = function (servicetype,payment_channel,username,paid,min_created_time,max_created_time,b) {
            var d=[];var c ='';
            if(b){
                d[0] = b;
                c = angular.toJson(d);
            }
            return $http({
                method: 'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    max_results:50,
                    start_index:-1,
                    servicetype:servicetype,
                    payment_channel:payment_channel,
                    paid:paid,
                    username:username,
                    min_created_time:min_created_time,
                    max_created_time:max_created_time,
                    plate_number:c
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                return response.data;
            });
        };
        self.queryDetail = function(journalid){
            return $http({
                method :'GET',
                url:ONLINE_PAYMENT,
                headers:{
                    'Content-Type':'application/json'
                },
                params:{
                    querytype:'one',
                    journalid:journalid
                },
                withCredentials:true,
                ignoreLoadingBar: true
            }).then(function(response){
                return response.data;
            });
        }
    }
})();