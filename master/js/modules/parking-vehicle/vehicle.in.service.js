/**
 * Created by huangxiang  on 2016/11/24 0024.
 * @author: huangxiang
 * Module: vehicle.in.service.js
 * feature: 停车入场记录与后台交互service
 */
(function () {
    angular.module('app.vehicle')
        .service('VehicleInService',VehicleInService);
    VehicleInService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function VehicleInService($http, URL_SEED) {
        var self = this;
        var baseUrl = URL_SEED.API_URL + 'parking/inout/';
        var exporeUrl=URL_SEED.API_URL+'operation/inout_export/';
        /*获取首页记录*/
        self.readHome = function (parking_lot_id,plate_number,a,b) {
            return $http({
                method: 'GET',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: 0,
                    parklotids:parking_lot_id,
                    plate_number:plate_number,
                    type:1,
                    min_intime:a,
                    max_intime:b
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
        self.readRecords = function (start_index,max_results , pagetype,parking_lot_id,plate_number,a,b) {
            return $http({
                method: 'GET',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: start_index,
                    pagedirect: pagetype,
                    parklotids:parking_lot_id,
                    plate_number:plate_number,
                    type:1,
                    min_intime:a,
                    max_intime:b
                },
                withCredentials: true,
            }).then(function (response) {
                return response.data;
            });
        };

        /*获取尾页记录*/
        self.readLastPage = function (parking_lot_id,plate_number,a,b) {
            return $http({
                method: 'GET',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: -1,
                    parklotids:parking_lot_id,
                    plate_number:plate_number,
                    type:1,
                    min_intime:a,
                    max_intime:b
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*刷新当前页的数据*/
        self.readNowPage = function (now_start_index,now_max_results,pagetype,parking_lot_id,now_plate_number,a,b) {
            return $http({
                method: 'GET',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: now_max_results,
                    start_index: now_start_index,
                    pagedirect: pagetype,
                    parking_lot_id:parking_lot_id,
                    plate_number:now_plate_number,
                    type:1,
                    min_intime:a,
                    max_intime:b
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
        //获取导出扥接口
        self.vehicleExplede=function (parklot_id,plate_number,startime,endtime,max_id) {
            return $http({
                method: 'GET',
                url: exporeUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    parklot_id:parklot_id,
                    plate_number:plate_number,
                    startime:startime,
                    endtime:endtime,
                    max_id:max_id
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });

        }

    }
})();