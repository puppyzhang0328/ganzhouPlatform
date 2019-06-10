(function () {
    angular.module('app.parking')
        .factory('ParkActionService', ParkActionService);
    ParkActionService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function ParkActionService($http, URL_SEED) {
        var service = {};
        var PARKACTION_URL = URL_SEED.API_URL + 'parking/lotfc/';
        var PARKPOWER_URL = URL_SEED.API_URL + 'parking/func/';
        // var PARKACTION_URL = 'data/parkAction.json';
        //新增停车场功能配置
        service.addParkAction = function (parklot, funcbase) {
            var gate_info = angular.toJson({
                funcbase: funcbase,
                parklot: parklot
            });
            return $http({
                method: 'POST',
                url: PARKACTION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*修改停场功能配置*/
        service.modifyParkAction = function (funcb_id, funcname, introduce) {
            var gate_info = angular.toJson({
                funcb_id: funcb_id,
                funcname: funcname,
                introduce: introduce
            });
            return $http({
                method: 'PUT',
                url: PARKACTION_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*删除停车场功能配置*/
        service.deleteParkAction = function (funcb_id) {
            var gate_info = angular.toJson({funcb_id: funcb_id});
            return $http({
                method: 'DELETE',
                url: PARKACTION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        //查询所有的功能列表
        service.qeuryAllPower = function (funcb_id) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    funcb_id:funcb_id
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        //分页查询
        service.readRecords =function(start_index,pagedirect,park_id) {
            return $http({
                method: 'GET',
                url: PARKACTION_URL,
                params: {
                    max_results: 50,
                    start_index: start_index,
                    pagedirect: pagedirect,
                    park_id:park_id
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        return service;
    }
})();
