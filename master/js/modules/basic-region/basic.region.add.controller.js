/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('AddRegionCtr', AddRegionCtr);
    AddRegionCtr.$inject = ['$location', 'regionService', 'logger'];
    'use strict';
    function AddRegionCtr($location, regionService, logger) {
        var vm = this;
        var selectPark = [];//所选择的停车场
        /*停车场选择-------------------------------------------------*/
        vm.regiongAsync = [];
        var allRegions = [];
        vm.eventResult = {
            model:{
                id :undefined
            }
        }
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
        vm.addRegion = addRegion; // 添加停车场
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        function addRegion() {
            if(vm.eventResult.model.id !== undefined){
                vm.region.pcode = vm.eventResult.model.id;
            };
            regionService.addRegion(vm.region.code,vm.region.pcode,vm.region.name,vm.region.suffix,vm.region.fullname,vm.region.pinyin,vm.region.py,vm.region.level).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'区域：'+vm.region.name,'操作成功');
                    $location.path('/app/region');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.region.name + '"' + '失败!', region.status, '该区域已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/region');
        }
    }
})();