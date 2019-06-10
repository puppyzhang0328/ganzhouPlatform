/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.bill')
        .factory('ParkingBill', ParkingBill);

    ParkingBill.$inject = ['$http', 'URL_SEED'];

    'use strict';
    function ParkingBill($http, URL_SEED) {
        var OFFLINE_BILL_URL = URL_SEED.API_URL + 'operation/finance/';

        return {
            queryOfflineBill: queryOfflineBill
        };

        function queryOfflineBill(startdate, enddate, parklotids) {
            return $http({
                method: 'GET',
                url: OFFLINE_BILL_URL,
                params: {
                    parklotids: parklotids.toString(),
                    startdate: startdate,
                    enddate: enddate
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();