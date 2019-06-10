(function () {
    angular.module('app.parking')
        .factory('ParkPowerService', ParkPowerService);
    ParkPowerService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function ParkPowerService($http, URL_SEED) {
        var service = {};
        var PARKPOWER_URL = URL_SEED.API_URL + 'parking/func/';
        /*新增停车场功能*/
        service.addParkPower = function (funcname, introduce) {
            var gate_info = angular.toJson({
                funcname: funcname,
                introduce: introduce
            });
            return $http({
                method: 'POST',
                url: PARKPOWER_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*修改停场功能*/
        service.modifyParkPower = function (funcbId, funcname, introduce) {
            var gate_info = angular.toJson({
                funcb_id: funcbId,
                funcname: funcname,
                introduce: introduce
            });

            return $http({
                method: 'PUT',
                url: PARKPOWER_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*删除停车场功能*/
        service.deleteParkPower = function (funcb_id) {
            var gate_info = angular.toJson({funcb_id: funcb_id});
            return $http({
                method: 'DELETE',
                url: PARKPOWER_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        //分页查询
        service.readRecords =function(start_index,pagedirect) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    max_results: 50,
                    start_index: start_index,
                    pagedirect: pagedirect
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
