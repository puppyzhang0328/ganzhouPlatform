/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('addPoliceController', addPoliceController);
    addPoliceController.$inject = ['$location', 'policeService', 'logger','bureauService'];
    'use strict';
    function addPoliceController($location, policeService, logger,bureauService) {
        var vm = this;
        var selectRegion = [];
        vm.bureaugAsync = [];
        var allBureaus = [];
        bureauService.queryBureau().then(function (response) {
            // vm.bureaugAsync = response.records;
            angular.forEach(response.records, function (value,index) {
                vm.bureaugAsync.push(value);
                vm.bureaugAsync[index].name = value.cityproperName;
                allBureaus.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectBureau.id = vm.eventResult.model.id;
        };
        vm.selectBureau = {
            id: undefined
        };
        vm.addPolice = addPolice;
        vm.backToPrevious = backToPrevious;
        function addPolice() {
            vm.police.bureauid = vm.selectBureau.id ;
            policeService.addPolice(vm.police.stationCode,vm.police.stationName,vm.police.bureauid).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'警局：'+vm.police.stationName,'操作成功');
                    $location.path('/app/police');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.police.stationName + '"' + '失败!', vm.police.stationName, '该警局已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/police');
        }
    }
})();