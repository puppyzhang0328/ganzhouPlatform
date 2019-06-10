(function () {
    angular.module('app.iotdevice')
        .factory('iotdeviceService', iotdeviceService);
    iotdeviceService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function iotdeviceService($http, URL_SEED) {
        var service = {};
        var IOTDEVICE = URL_SEED.API_URL + 'device/iotdevice/';
        service.addIotdevice = function (devtype,parklot,ipaddr,devname,memo,brand,devfirm,firmcontact,firmphone) {
            var iotdevice = angular.toJson({
                devtype:devtype,
                parklot:parklot,
                ipaddr:ipaddr,
                devname:devname,
                memo:memo,
                brand:brand,
                devfirm:devfirm,
                firmcontact:firmcontact,
                firmphone:firmphone
            });
            return $http({
                method: 'POST',
                url: IOTDEVICE,
                headers: {
                    'Content-type': 'application/json'
                },
                data: iotdevice,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.modifyIotdevice = function (iotdevice_id,devtype,parklot,ipaddr,devname,memo,brand,devfirm,firmcontact,firmphone) {
            var iotdevice = angular.toJson({
                iotdevice_id:iotdevice_id,
                devtype:devtype,
                parklot:parklot,
                ipaddr:ipaddr,
                devname:devname,
                memo:memo,
                brand:brand,
                devfirm:devfirm,
                firmcontact:firmcontact,
                firmphone:firmphone
            });
            return $http({
                method: 'PUT',
                url: IOTDEVICE,
                headers: {
                    'Content-type': 'application/json'
                },
                data: iotdevice,
                withCredentials: true

            }).then(function (response) {
                return response.data;
            });
        };
        service.deleteIotdevice = function (id) {
            var iotdevice = angular.toJson({iotdevice_id: id});
            return $http({
                method: 'DELETE',
                url: IOTDEVICE,
                headers: {
                    'Content-type': 'application/json'
                },
                data: iotdevice,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.readRecords =function(start_index,pagedirect,parklot,devtype,devname,devfirm) {
            return $http({
                method: 'GET',
                url: IOTDEVICE,
                params: {
                    max_results: 50,
                    start_index: start_index,
                    pagedirect: pagedirect,
                    parklot:parklot,
                    devtype:devtype,
                    devname:devname,
                    devfirm:devfirm
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.queryIotdeviceDetail =function(id) {
            return $http({
                method: 'GET',
                url: IOTDEVICE,
                params: {
                    querytype:'one',
                    iotdevice_id:id
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
