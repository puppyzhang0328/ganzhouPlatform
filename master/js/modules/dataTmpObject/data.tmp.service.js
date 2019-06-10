(function () {
    angular.module('app.parking')
        .factory('dataTmpService', dataTmpService);
    dataTmpService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function dataTmpService($http, URL_SEED) {
        var service = {};
        var INDUCEMENT_URL = URL_SEED.API_URL + 'join3rd/dataTmpObject/';
        service.queryDataTmp = function (start_index,pagedirect,plateform,parklot,status,startime,endtime) {
            return $http({
                method: 'GET',
                url: INDUCEMENT_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    start_index:start_index,
                    pagedirect:pagedirect,
                    plateform: '2',
                    parklot:parklot,
                    status:status,
                    startime:startime,
                    endtime:endtime
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
