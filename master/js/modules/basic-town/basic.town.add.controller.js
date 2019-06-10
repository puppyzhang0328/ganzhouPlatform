/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('AddTownCtr', AddTownCtr);
    AddTownCtr.$inject = ['$location', 'townService', 'logger','regionService'];
    'use strict';
    function AddTownCtr($location, townService, logger,regionService) {
        var vm = this;
        var selectPark = [];//所选择的停车场
        /*停车场选择-------------------------------------------------*/
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
            vm.seletPark.id = vm.eventResult.model.id;
        };
        vm.seletPark = {
            id: undefined
        };
        vm.addTown = addTown; // 添加停车场
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        function addTown() {
            vm.town.region = vm.eventResult.model.id;
            townService.addTown(vm.town.code,vm.town.name,vm.town.region).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'商圈：'+vm.town.name,'操作成功');
                    $location.path('/app/town');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.town.name + '"' + '失败!', vm.town.name, '该商圈已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/town');
        }
    }
})();