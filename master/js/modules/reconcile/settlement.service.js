(function () {
    angular.module('app.parking')
        .factory('settlementService', settlementService);
    settlementService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function settlementService($http, URL_SEED) {
        var service = {};
        var PARKPOWER_URL = URL_SEED.API_URL + 'billing/settlement/';
        //对账查询
        service.readRecords =function(parklotid,begintime,endtime,settletype) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    parklotid:parklotid,
                    begintime:begintime,
                    endtime:endtime,
                    settletype:settletype
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        return service;
    }
})();
