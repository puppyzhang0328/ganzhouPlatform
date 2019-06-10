/**
 * Created by huangxiang  on 2016/12/16 0016.
 * @author: huangxiang
 * Module: get-park-list.factory.js
 * feature: 获取所有的停车场数据并保存以便于多个controller调用
 */
(function () {
    angular.module('app.utils')
        .factory('ParkList', ParkList);

    ParkList.$inject = ['ManageParkingService', '$log'];

    'use strict';

    /**
     * 获取停车场数据的factory
     * @param ManageParkingService 与服务器通信的service
     * @param $log
     * @constructor
     */
    function ParkList(ManageParkingService, $log) {
        var Parks = [];
        var parkingAsync = [];

        getParkList();
        return {
            getParkId:getParkId,
            getParkAsyn:getParkAsyn
        };

        function getParkList() {
            ManageParkingService.queryParking().then(function (response) {
                parkingAsync = response.parking_lots;
                angular.forEach(response.parking_lots, function (value) {
                    Parks.push(value.id);
                });

                $log.info(parkingAsync);
                $log.info(Parks);
            });
        }

        function getParkId() {
            console.log(Parks);
            return Parks;
        }
        
        function getParkAsyn() {
            console.log(parkingAsync);
            return parkingAsync;
        }
    }
})();
