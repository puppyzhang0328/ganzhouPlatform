(function () {
    angular.module('app.analysis')
        .factory('analysisOrganService', analysisOrganService);
    analysisOrganService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function analysisOrganService($http, URL_SEED) {
        var ANALYSISUSER = URL_SEED.API_URL + 'operation/parklot_operator/';
        return {
            readRecords:readRecords
        };
        function readRecords(startime,endtime,time_type,max_results,start_index,pagedirect,a) {
            return $http({
                method: 'GET',
                url: ANALYSISUSER,
                params: {
                    organization:a,
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