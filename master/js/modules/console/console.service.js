/**
 * Create By yumaotao 2017/7/21 0023
 * 
 *
* */
(function () {
    angular.module("app.console")
        .factory('ConsoleService', ConsoleService);
    ConsoleService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function  ConsoleService($http,URL_SEED) {
        var service ={};
        // var CONSOLE_URL = URL_SEED.API_URL + 'operation/vehiclestat/';
        var CONSOLE_URL = URL_SEED.API_URL + 'operation/vehiclestat/';//消费次数、消费金额、故障次数查询
        var PARKING_URL = URL_SEED.API_URL + 'parking/parking_lots/'; // 剩余车位数
        var USERSUM_URL = URL_SEED.API_URL + 'operation/growthRate/';//用户数据统计
        var COUNT_URL = URL_SEED.API_URL + 'operation/console_warning/';//控制台上方数据展示
        var REGIONPAY = URL_SEED.API_URL + 'operation/consunption_reg/';//区域消费查询
        var USERURL = URL_SEED.API_URL + 'operation/consunption_appuser/';//用户数据统计
        service.queryConsoleCount = function () {
            return $http({
                method: 'GET',
                url: COUNT_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
    //    查询消费、次数、故障次数
        service.queryConsole = function (parkid,startime,endtime,time_type) {
            return $http({
                method: 'GET',
                url: CONSOLE_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                    parkid:parkid,
                    startime:startime,
                    endtime:endtime,
                    time_type:time_type
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        //查询停车场
        service.queryUserState = function (parkid,startime,endtime,time_type) {
            return $http({
                method: 'GET',
                url: USERSUM_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                    parkid:parkid,
                    startime:startime,
                    endtime:endtime,
                    time_type:time_type
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*查询百度地图信息*/
        service.queryParking = function (parklotid) {
            return $http({
                method: 'GET',
                url: PARKING_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                    parklotid:parklotid
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.queryRegionPay = function (startime) {
            return $http({
                method: 'GET',
                url: REGIONPAY,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                    querytype:'all',
                    startime:startime
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.queryUserStatistics = function (startime,endtime) {
            return $http({
                method: 'GET',
                url: USERURL,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                    time_type:'day',
                    startime:startime,
                    endtime:endtime
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
