(function () {
    angular.module('app.parking')
        .factory('examineGroupService', examineGroupService);
    examineGroupService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function examineGroupService($http, URL_SEED) {
        var service = {};
        var PARKPOWER_URL = URL_SEED.API_URL + 'billing/settlement/';
        var DOWPDF_URL = URL_SEED.IMG_URL + 's/billpdf/';
        service.confirmBill =function(settlement,option,memo) {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    settlement:settlement,
                    option:option,
                    memo:memo
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.lookupBill =function() {
            return $http({
                method: 'GET',
                url: PARKPOWER_URL,
                params: {
                    query_record:'bill'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.downloadPDF =function(bill_name,organization_name,stroke_count,aggregate_amount,aggregate_netreceipts,startime,endtime,coupon_fee) {
            var PDFDATE = angular.toJson({
                bill_name:bill_name,
                organization_name:organization_name,
                stroke_count:stroke_count,
                aggregate_amount:aggregate_amount/100,
                aggregate_netreceipts:aggregate_netreceipts/100,
                startime:startime,
                endtime:endtime,
                coupon_fee:coupon_fee/100
            });
            return $http({
                method: 'POST',
                url: DOWPDF_URL,
                data: PDFDATE,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        return service;
    }
})();
