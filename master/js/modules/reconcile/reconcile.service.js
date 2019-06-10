(function () {
    angular.module('app.parking')
        .factory('reconcileService', reconcileService);
    reconcileService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function reconcileService($http, URL_SEED) {
        var service = {};
        var PARKPOWER_URL = URL_SEED.API_URL + 'billing/parklotreconcile/';
        //对账查询
        service.readRecords =function(parklotid,begintime,endtime,plate_number) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    parklotid:parklotid,
                    begintime:begintime,
                    endtime:endtime,
                    plate_number:plate_number
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        service.exportReconcile =function(parklotid,begintime,endtime) {
            var reconcileDate = angular.toJson({
                parklotid:parklotid,
                begintime:begintime,
                endtime:endtime
            });
            return $http({
                method: 'POST',
                url: PARKPOWER_URL,
                data: reconcileDate,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        return service;
    }
})();
