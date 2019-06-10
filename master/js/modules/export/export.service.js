/**
 * bill.online.service.js.js
 * @author: huangxiang
 * @create 2016-12-29 16:01
 */
(function () {
    angular.module('app.sidebar')
        .factory('exportService', exportService);
    exportService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function exportService($http, URL_SEED) {
        return {
            exportData:exportData//导入数据
        };
        //新增区域信息
        function exportData(dataUrl,data) {
            return $http({
                method: 'PUT',
                url: dataUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();