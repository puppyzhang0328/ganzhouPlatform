(function () {
    angular.module('app.parking')
        .service('ParkingStateService',ParkingStateService);
    ParkingStateService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function ParkingStateService($http, URL_SEED) {
        var self = this;
        // var baseUrl = URL_SEED.API_URL + 'parking/parking_lots/';
        // var NEWURL = URL_SEED.API_URL + 'parking/network/';
        //最新接口
        var baseUrl=URL_SEED.API_URL+'parking/parklot_online/';
        /*获取首页记录*/
        self.readHome = function (parking_lot_id,plate_number) {
            return $http({
                method: 'GET',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 100,
                    start_index: 0,
                    parklotid:parking_lot_id,
                    plate_number:plate_number
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
        // self.readRecords = function (start_index, max_result, pagetype,parking_lot_id,plate_number) {
        //     return $http({
        //         method: 'GET',
        //         url: baseUrl,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         params: {
        //             start_index: start_index,
        //             max_results: max_result,
        //             pagedirect: pagetype,
        //             parklotid:parking_lot_id,
        //             plate_number:plate_number
        //         },
        //         withCredentials: true,
        //         ignoreLoadingBar: true
        //     }).then(function (response) {
        //         return response.data;
        //     });
        // };
        /*获取尾页记录*/
        self.readLastPage = function (parking_lot_id,plate_number) {
            return $http({
                method: 'GET',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    max_results: 50,
                    start_index: -1,
                    parklotid:parking_lot_id,
                    plate_number:plate_number
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*刷新当前页的数据*/
            self.readNowPage = function (now_start_index,now_max_results,parking_lot_id,now_plate_number,pagetype) {
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
                        parklotid:parking_lot_id,
                        plate_number:now_plate_number
                    },
                    withCredentials: true,
                    ignoreLoadingBar: true
                }).then(function (response) {
                    return response.data;
                });
        };

        //分页查询不在线功能
        self.readRecords=function (querytype,start_index,pagedirect) {
              return $http({
                  method: 'GET',
                   url: baseUrl,
                  params:{
                      querytype:querytype,
                      state:'offline',
                      start_index:start_index,
                      max_results:100,
                      pagedirect:pagedirect
                  },
                  withCredentials: true,
                  ignoreLoadingBar: true
              }).then(function (response) {
                  return response.data;
              })
        };
      //分页在线功能查询
        self.onlineRecords=function (querytype,state) {
            return $http({
                method: 'GET',
                url: baseUrl,
                params:{
                    querytype:querytype,
                    state:state
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            })
        };
        //在线和不在线查询某一个数据
        self.queryOneRecords=function (querytype,parklot) {
            return $http({
                method: 'GET',
                url: baseUrl,
                params:{
                    querytype:querytype,
                    parklot:parklot
                },
                withCredentials: true,
                ignoreLoadingBar: true
            }).then(function (response) {
                return response.data;
            })
        }

    }
})();