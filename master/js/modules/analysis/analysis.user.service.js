(function () {
    angular.module('app.analysis')
        .factory('analysisUserService', analysisUserService);
    analysisUserService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function analysisUserService($http, URL_SEED) {
        var ANALYSISUSER = URL_SEED.API_URL + 'operation/consunption_appuser/';
        return {
            readRecords:readRecords
        };
        function readRecords(startime,endtime,time_type,max_results,start_index,pagedirect) {
            return $http({
                method: 'GET',
                url: ANALYSISUSER,
                params: {
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