(function () {
    angular.module('app.parking')
        .factory('examineService', examineService);
    examineService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function examineService($http, URL_SEED) {
        var service = {};
        var PARKPOWER_URL = URL_SEED.API_URL + 'billing/settlement/';
        var PERSON_URL = URL_SEED.API_URL + 'orgman/orguserprofile/';
        service.generateBill =function(organization) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    organization:organization,
                    found:'bill'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.findBill =function(a) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    query_record:'bill',
                    status:a
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.userRecords =function() {
            var reconcileDate = angular.toJson({
                query_record:'bill'
            });
            return $http({
                method: 'POST',
                url: PARKPOWER_URL,
                data: reconcileDate,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.queryPerson =function() {
            return $http({
                method: 'GET',
                url: PERSON_URL,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.putInfo =function(settlement,userid) {
            var putInfo = angular.toJson({
                settlement:settlement,
                userid:userid
            });
            return $http({
                method: 'POST',
                url: PARKPOWER_URL,
                data: putInfo,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };

        //异常已处理，重新生成账单
        service.NoHandlingBill =function(organization,endtime) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    organization:organization,
                    found:'bill',
                    settlement_time:endtime
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        //点击搜索按钮
        service.findBillSearch =function(a,organization) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    query_record:'bill',
                    status:a,
                    organization:organization
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
