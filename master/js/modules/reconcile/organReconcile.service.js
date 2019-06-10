(function () {
    angular.module('app.parking')
        .factory('organReconcileService', organReconcileService);
    organReconcileService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function organReconcileService($http, URL_SEED) {
        var service = {};
        var ORGAN_URL = URL_SEED.API_URL + 'billing/parklotreconcile/';
        service.readRecords =function(organId,begintime,endtime,lottype) {
            return $http({
                method: 'GET',
                url: ORGAN_URL,
                params: {
                    ownerid:organId,
                    begintime:begintime,
                    endtime:endtime,
                    lottype:lottype
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        service.exportReconcile =function(organId,begintime,endtime,lottype) {
            var reconcileDate = angular.toJson({
                ownerid:organId,
                begintime:begintime,
                endtime:endtime,
                lottype:lottype
            });
            return $http({
                method: 'POST',
                url: ORGAN_URL,
                data: reconcileDate,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        return service;
    }
})();
