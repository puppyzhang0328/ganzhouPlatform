(function () {
    angular.module('app.analysis')
        .factory('analysisPayService', analysisPayService);
    analysisPayService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function analysisPayService($http, URL_SEED) {
        var ANALYSISPAY = URL_SEED.API_URL + 'operation/consunption_park/';
        return {
            readRecords:readRecords
        };
        function readRecords(parkid,startime,endtime,time_type,max_results,start_index,pagedirect) {
            return $http({
                method: 'GET',
                url: ANALYSISPAY,
                params: {
                    parkid: parkid,
                    startime:startime,
                    endtime:endtime,
                    time_type:time_type,
                    max_results: max_results,
                    start_index: start_index,
                    pagedirect: pagedirect
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();