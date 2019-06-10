(function () {
    angular.module('app.mobile-user')
        .factory('userPay', userPay);
    userPay.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function userPay($http, URL_SEED) {
        var APPUSERPAY_URL = URL_SEED.API_URL + 'billing/onlinebill/';
        return {
            queryHome: queryHome
        };
        function queryHome(a) {
            return $http({
                method: 'GET',
                url: APPUSERPAY_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    querytype:'all',
                    username:a
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();