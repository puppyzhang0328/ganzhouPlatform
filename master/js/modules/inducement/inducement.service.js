(function () {
    angular.module('app.parking')
        .factory('inducementService', inducementService);
    inducementService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function inducementService($http, URL_SEED) {
        var service = {};
        var INDUCEMENT_URL = URL_SEED.API_URL + 'device/inducement/';
        // var INDUCEMENT_URL = 'http://120.24.249.69:8000/parkhero/v0.1/device/inducement/';
        // var INDUCEMENTOWR_URL = 'http://120.24.249.69:8000/parkhero/v0.1/join3rd/controlcard/';
        var INDUCEMENTOWR_URL = URL_SEED.API_URL + 'join3rd/controlcard/';
        var OPERATION_URL = URL_SEED.API_URL + 'operation/parklots/';
        var INDUCARD_URL = URL_SEED.API_URL + 'device/cardinfo/';
        service.addInducement = function (seletParkId,card_number,handle_type,handle_way,font_color,in_type,msg_info) {
            var inducement_info = angular.toJson({
                parklot:seletParkId,
                card_number:card_number,
                handle_type:handle_type,
                font_color:font_color,
                in_type:in_type,
                handle_way:handle_way,
                msg_info:msg_info
            });
            return $http({
                method: 'POST',
                url: INDUCEMENT_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: inducement_info,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        };
        service.addInducementOwer = function (seletParkId,card_number,handle_type,handle_way,font_color,in_type,msg_info) {
            var inducement_info = angular.toJson({
                parklot:seletParkId,
                card_number:card_number,
                handle_type:handle_type,
                font_color:font_color,
                in_type:in_type,
                handle_way:handle_way,
                msg_info:msg_info
            });
            return $http({
                method: 'PUT',
                url: INDUCEMENTOWR_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: inducement_info,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        };
        service.queryParking = function () {
            return $http({
                method: 'GET',
                url: OPERATION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    'querytype': 'all'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.queryCard = function (CardNum,IsOnline) {
            return $http({
                method: 'GET',
                url: INDUCARD_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    CardNum : CardNum,
                    IsOnline:IsOnline
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.modifyCard = function (CardId,CardNum) {
            var carinfo = angular.toJson({
                CardId:CardId,
                CardNum:CardNum
            });
            return $http({
                method: 'PUT',
                url: INDUCARD_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: carinfo,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        };
        service.addCard = function (CardNum) {
            var inducement_info = angular.toJson({
                CardNum:CardNum
            });
            return $http({
                method: 'POST',
                url: INDUCARD_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: inducement_info,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        };
        service.deleteCard = function (CardId) {
            var inducement_info = angular.toJson({
                CardId:CardId
            });
            return $http({
                method: 'DELETE',
                url: INDUCARD_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: inducement_info,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
