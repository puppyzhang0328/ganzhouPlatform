(function () {
    angular.module('app.analysis')
        .factory('analysisRegionService', analysisRegionService);
    analysisRegionService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function analysisRegionService($http, URL_SEED) {
        var ANALYSISREGION = URL_SEED.API_URL + 'operation/consunption_reg/';
        // var ANALYSISREGION = "../acttst/data/analysis.json";
        return {
            readRecords:readRecords
        };
        function readRecords(regionId,startime,endtime,time_type,max_results,start_index,pagedirect) {
            return $http({
                method: 'GET',
                url: ANALYSISREGION,
                params: {
                    regionid: regionId,
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