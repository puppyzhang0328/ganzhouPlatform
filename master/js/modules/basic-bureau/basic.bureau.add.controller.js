/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('addBureauController', addBureauController);
    addBureauController.$inject = ['$location', 'bureauService', 'logger','regionService'];
    'use strict';
    function addBureauController($location, bureauService, logger,regionService) {
        var vm = this;
        var selectRegion = [];
        vm.regiongAsync = [];
        var allRegions = [];
        regionService.queryRegion().then(function (response) {
            vm.regiongAsync = response.records;
            angular.forEach(response.records, function (value) {
                allRegions.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectRegion.id = vm.eventResult.model.id;
        };
        vm.selectRegion = {
            id: undefined
        };
        vm.addBureau = addBureau;
        vm.backToPrevious = backToPrevious;
        function addBureau() {
            vm.bureau.region = vm.selectRegion.id ;
            bureauService.addBureau(vm.bureau.cityproperCode,vm.bureau.cityproperName,vm.bureau.region).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'警局：'+vm.bureau.stationName,'操作成功');
                    $location.path('/app/bureau');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.bureau.stationName + '"' + '失败!', vm.bureau.stationName, '该警局已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/bureau');
        }
    }
})();