(function () {
    angular.module('app.analysis')
        .factory('analysisBusTypeService', analysisBusTypeService);
    analysisBusTypeService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function analysisBusTypeService($http, URL_SEED) {
        var ANALYSISBUSINESS = URL_SEED.API_URL + 'operation/consunption_business/';
        return {
            readRecords:readRecords
        };
        function readRecords(busTypeId,startime,endtime,time_type,max_results,start_index,pagedirect) {
            return $http({
                method: 'GET',
                url: ANALYSISBUSINESS,
                params: {
                    businessid: busTypeId,
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