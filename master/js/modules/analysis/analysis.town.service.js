(function () {
    angular.module('app.analysis')
        .factory('analysisTownService', analysisTownService);
    analysisTownService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function analysisTownService($http, URL_SEED) {
        var ANALYSISTOWN = URL_SEED.API_URL + 'operation/consunption_town/';
        return {
            readRecords:readRecords
        };
        function readRecords(townId,startime,endtime,time_type,max_results,start_index,pagedirect) {
            return $http({
                method: 'GET',
                url: ANALYSISTOWN,
                params: {
                    townid: townId,
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